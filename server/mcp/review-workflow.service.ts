import {
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    Optional,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Types } from "mongoose";
import { Roles } from "../auth/ability/ability.factory";
import type { IClaimService } from "../interfaces/claim.service.interface";
import { NotificationService } from "../notifications/notifications.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { ReportModelEnum, ReviewTaskTypeEnum } from "../types/enums";
import * as notificationMessages from "../../public/locales/pt/notification.json";

// Sentence page path, as src/utils/GetSentenceContentHref.ts builds it for
// speeches (the only content the MCP queue creates). Imported logic from
// src/ would pull frontend modules into the server build.
function sentencePath(nameSpace: string, claim: any, dataHash: string) {
    const base = nameSpace !== "main" ? `/${nameSpace}` : "";
    const personality = claim?.personalities?.[0];
    const claimPath = personality?.slug
        ? `/personality/${personality.slug}/claim/${claim?.slug}`
        : `/claim/${claim?.slug}`;
    return `${base}${claimPath}/sentence/${dataHash}`;
}

export interface StartReviewTaskInput {
    claimId: string;
    dataHash: string;
    nameSpace: string;
}

interface WorkflowUser {
    _id: string;
    role?: Record<string, string>;
}

// The web app persists XState's state.value, so the compound `assigned`
// state (draft sub-states) is stored as an object. The Kanban queries
// `machine.value.assigned`, so a plain "assigned" string would be invisible.
export const ASSIGNED_VALUE = { assigned: "undraft" };

const CROSS_CHECKING_VALUES = ["cross-checking", "addCommentCrossChecking"];

const DEFAULT_MAX_ASSIGNEES = 10;

// Classification that publishes without report content (mirrors
// src/machines/reviewTask/validation.ts).
const NOT_FACT_CLASSIFICATION = "not-fact";

// Sentences are the leaves of a claim's content tree: paragraphs also carry
// a data_hash, but their `content` is an array rather than a string.
function collectSentenceHashes(node: any, found: string[] = []): string[] {
    if (Array.isArray(node)) {
        node.forEach((child) => collectSentenceHashes(child, found));
    } else if (node && typeof node === "object") {
        if (node.data_hash && typeof node.content === "string") {
            found.push(node.data_hash);
        }
        Object.values(node).forEach((child) =>
            collectSentenceHashes(child, found)
        );
    }
    return found;
}

// Mirrors getInitialContext(ReviewTaskTypeEnum.Claim, { usersId }) from
// src/machines/reviewTask/context.ts, which the frontend uses to hydrate its
// XState machine. A parity spec keeps the two in sync.
export function buildClaimContext(usersId: string[], claimId: string) {
    return {
        reviewData: {
            usersId,
            summary: "",
            classification: "",
            reviewerId: null,
            crossCheckerId: null,
            crossCheckingComments: [],
            crossCheckingComment: "",
            crossCheckingClassification: "",
            questions: [],
            report: "",
            verification: "",
            sources: [],
        },
        review: {
            personality: "",
            usersId: "",
            targetId: claimId,
            target: claimId,
            isPartialReview: false,
        },
    };
}

/** Human-readable workflow state, flattening compound values like `{assigned: "draft"}`. */
export function stateName(value: unknown): string {
    if (value && typeof value === "object") {
        return Object.keys(value)[0];
    }
    return String(value);
}

const toObjectId = (id: string) => new Types.ObjectId(id);

const idsEqual = (a: unknown, b: unknown) =>
    !!a && !!b && a.toString() === b.toString();

/**
 * Review-task workflow driven from MCP. The state machine itself lives in the
 * frontend (XState); the server persists whatever `machine` it receives. This
 * service builds the machine documents the frontend expects, validating the
 * current state before each transition, and writes them through
 * ReviewTaskService so history, state events and publishing stay intact.
 *
 * Every hand-out of shared work (next task, next review) is one guarded
 * findOneAndUpdate on the source state, so concurrent callers can never
 * receive the same task.
 */
@Injectable()
export class ReviewWorkflowService {
    private readonly logger = new Logger(ReviewWorkflowService.name);

    constructor(
        @Inject("ClaimService") private readonly claimService: IClaimService,
        private readonly reviewTaskService: ReviewTaskService,
        @Optional() private readonly configService?: ConfigService,
        @Optional() private readonly notificationService?: NotificationService
    ) {}

    /**
     * Claims a claim sentence for review: the web app treats "no task" as
     * unassigned, so starting is creating the task already `assigned` to the
     * caller (the same shape saveDraft auto-creates).
     */
    async startReviewTask(
        user: { _id: string },
        { claimId, dataHash, nameSpace }: StartReviewTaskInput
    ): Promise<unknown> {
        const claim: any = await this.claimService.getById(claimId, nameSpace);
        if (!claim) {
            throw new NotFoundException(`Claim ${claimId} not found`);
        }
        if (!collectSentenceHashes(claim).includes(dataHash)) {
            throw new NotFoundException(
                `data_hash ${dataHash} is not a sentence of claim ${claimId}`
            );
        }

        const existing = await this.reviewTaskService.getReviewTaskByDataHash(
            dataHash
        );
        if (existing) {
            // A queued (`unassigned`) task is taken, atomically, the same way
            // next_review_task takes it; anything further along is someone
            // else's work.
            const taken =
                stateName(existing.machine?.value) === "unassigned"
                    ? await this.reviewTaskService.transitionAtomically(
                          {
                              _id: existing._id,
                              "machine.value": "unassigned",
                          },
                          this.assignTo(user)
                      )
                    : null;
            if (!taken) {
                throw new ConflictException(
                    "A review task already exists for this sentence"
                );
            }
            return taken;
        }

        return this.reviewTaskService.create({
            data_hash: dataHash,
            reportModel: ReportModelEnum.FactChecking,
            reviewTaskType: ReviewTaskTypeEnum.Claim,
            nameSpace,
            target: claimId,
            recaptcha: "",
            machine: {
                value: ASSIGNED_VALUE,
                context: buildClaimContext([user._id], claimId),
            },
        } as any);
    }

    /**
     * Queue feed: creates an `unassigned` task for every sentence of the
     * claim that has none yet. Idempotent on data_hash. Returns the number
     * of tasks created.
     */
    async enqueueClaimSentences(
        claimId: string,
        nameSpace: string
    ): Promise<number> {
        const claim: any = await this.claimService.getById(claimId, nameSpace);
        if (!claim) {
            throw new NotFoundException(`Claim ${claimId} not found`);
        }
        const personality = claim.personalities?.[0];
        const personalityId = personality?._id ?? personality ?? "";
        let created = 0;
        for (const dataHash of collectSentenceHashes(claim)) {
            const context = buildClaimContext([], claimId);
            context.review.personality = personalityId
                ? personalityId.toString()
                : "";
            const inserted = await this.reviewTaskService.enqueueUnassigned({
                data_hash: dataHash,
                reportModel: ReportModelEnum.FactChecking,
                reviewTaskType: ReviewTaskTypeEnum.Claim,
                nameSpace,
                target: claimId,
                machine: { value: "unassigned", context } as any,
            });
            if (inserted) created++;
        }
        return created;
    }

    /** Takes the oldest `unassigned` task in the namespace and assigns it to the caller. */
    async nextReviewTask(user: WorkflowUser, nameSpace: string) {
        return this.reviewTaskService.transitionAtomically(
            { ...this.queueScope(nameSpace), "machine.value": "unassigned" },
            this.assignTo(user)
        );
    }

    private assignTo(user: { _id: string }) {
        return {
            $set: {
                "machine.value": ASSIGNED_VALUE,
                "machine.context.reviewData.usersId": [toObjectId(user._id)],
            },
        };
    }

    /**
     * Adds the caller to the task's assignees while it is being written
     * (`assigned`) or waiting for review (`reported`). Joining twice is a
     * no-op.
     */
    async joinReviewTask(user: WorkflowUser, task: any) {
        const assignees = task.machine?.context?.reviewData?.usersId ?? [];
        if (assignees.some((id: unknown) => idsEqual(id, user._id))) {
            return task;
        }
        const state = stateName(task.machine?.value);
        if (state !== "assigned" && state !== "reported") {
            throw new ConflictException(
                `Cannot join a task in state "${state}"; only assigned or reported tasks can be joined`
            );
        }
        const maxAssignees = this.maxAssignees();
        if (assignees.length >= maxAssignees) {
            throw new ConflictException(
                `Task already has the maximum of ${maxAssignees} assignees`
            );
        }
        const joined = await this.reviewTaskService.transitionAtomically(
            {
                _id: task._id,
                $or: [
                    { "machine.value.assigned": { $exists: true } },
                    { "machine.value": "reported" },
                ],
                // array length < maxAssignees, checked atomically
                [`machine.context.reviewData.usersId.${maxAssignees - 1}`]: {
                    $exists: false,
                },
            },
            {
                $addToSet: {
                    "machine.context.reviewData.usersId": toObjectId(user._id),
                },
            }
        );
        if (!joined) {
            throw new ConflictException(
                "The task changed state or filled up while joining; fetch it again"
            );
        }
        return joined;
    }

    /** The caller's oldest cross-checking task, plus how many are waiting. */
    async nextCrossChecking(user: WorkflowUser, nameSpace: string) {
        const filter = {
            ...this.queueScope(nameSpace),
            "machine.value": { $in: CROSS_CHECKING_VALUES },
            "machine.context.reviewData.crossCheckerId": toObjectId(user._id),
        };
        const [[task], waiting] = await Promise.all([
            this.reviewTaskService.findOldest(filter),
            this.reviewTaskService.countMatching(filter),
        ]);
        return { task: task ?? null, waiting };
    }

    /** Tasks in review (`submitted`) where the caller is the reviewer, oldest first. */
    async listMyReviewTasks(
        user: WorkflowUser,
        nameSpace: string,
        page: number,
        pageSize: number
    ) {
        const filter = {
            ...this.queueScope(nameSpace),
            "machine.value": "submitted",
            "machine.context.reviewData.reviewerId": toObjectId(user._id),
        };
        const [tasks, total] = await Promise.all([
            this.reviewTaskService.findOldest(filter, page, pageSize),
            this.reviewTaskService.countMatching(filter),
        ]);
        return { tasks, total, page, pageSize };
    }

    /**
     * Moves a `reported` task to the review backlog (`selectReviewer` with
     * no reviewer), where any reviewer can claim it. Assignees or admins only.
     */
    async sendToReview(user: WorkflowUser, task: any) {
        const assignees = task.machine?.context?.reviewData?.usersId ?? [];
        const isAssignee = assignees.some((id: unknown) =>
            idsEqual(id, user._id)
        );
        if (!isAssignee && !this.isAdmin(user, task.nameSpace)) {
            throw new ForbiddenException(
                "Only an assignee of the task or an admin can send it to review"
            );
        }
        const sent = await this.reviewTaskService.transitionAtomically(
            { _id: task._id, "machine.value": "reported" },
            {
                $set: {
                    "machine.value": "selectReviewer",
                    "machine.context.reviewData.reviewerId": null,
                },
            }
        );
        if (!sent) {
            throw new ConflictException(
                `Only reported tasks can be sent to review (task is "${stateName(
                    task.machine?.value
                )}")`
            );
        }
        this.notify(sent, "reviewSubmit", this.otherAssignees(sent, user));
        return sent;
    }

    /**
     * Takes the oldest task in the review backlog, makes the caller its
     * reviewer and moves it to `submitted`. Reviewers and admins only, and
     * never a task the caller is an assignee of (four-eyes).
     */
    async claimReviewTask(user: WorkflowUser, nameSpace: string) {
        const role = user.role?.[nameSpace];
        if (
            role !== Roles.Reviewer &&
            role !== Roles.Admin &&
            role !== Roles.SuperAdmin
        ) {
            throw new ForbiddenException(
                `Only reviewers or admins can claim a review in namespace "${nameSpace}"`
            );
        }
        const reviewerId = toObjectId(user._id);
        return this.reviewTaskService.transitionAtomically(
            {
                ...this.queueScope(nameSpace),
                "machine.value": "selectReviewer",
                "machine.context.reviewData.reviewerId": null,
                "machine.context.reviewData.usersId": { $ne: reviewerId },
            },
            {
                $set: {
                    "machine.value": "submitted",
                    "machine.context.reviewData.reviewerId": reviewerId,
                },
            }
        );
    }

    /**
     * Publishes a `submitted` task with the web publish rules: only its
     * reviewer (or an admin) may publish, and the report must be complete.
     */
    async publishReviewTask(user: WorkflowUser, task: any) {
        const reviewData = task.machine?.context?.reviewData ?? {};
        const isReviewer = idsEqual(reviewData.reviewerId, user._id);
        if (!isReviewer && !this.isAdmin(user, task.nameSpace)) {
            throw new ForbiddenException(
                "Only the task's reviewer or an admin can publish it"
            );
        }
        const state = stateName(task.machine?.value);
        if (state !== "submitted") {
            throw new ConflictException(
                `Only tasks in review (submitted) can be published (task is "${state}")`
            );
        }
        const missing = missingPublishFields(reviewData);
        if (missing.length) {
            throw new ConflictException(
                `Cannot publish: missing ${missing.join(", ")}`
            );
        }
        const published = await this.reviewTaskService.publishSubmitted(
            task._id.toString()
        );
        if (!published) {
            throw new ConflictException(
                "The task was published or moved by someone else"
            );
        }
        this.notify(
            published,
            "reviewPublished",
            published.machine.context.reviewData.usersId ?? []
        );
        return published;
    }

    private queueScope(nameSpace: string) {
        return {
            reviewTaskType: ReviewTaskTypeEnum.Claim,
            nameSpace,
            reportModel: ReportModelEnum.FactChecking,
        };
    }

    private isAdmin(user: WorkflowUser, nameSpace: string) {
        const role = user.role?.[nameSpace];
        return role === Roles.Admin || role === Roles.SuperAdmin;
    }

    private maxAssignees(): number {
        const configured = Number(
            this.configService?.get("mcp.task_queue.max_assignees")
        );
        return Number.isInteger(configured) && configured > 0
            ? configured
            : DEFAULT_MAX_ASSIGNEES;
    }

    private otherAssignees(task: any, user: WorkflowUser) {
        return (task.machine.context.reviewData.usersId ?? []).filter(
            (id: unknown) => !idsEqual(id, user._id)
        );
    }

    /**
     * Server-side counterpart of src/notifications/sendReviewNotifications.ts
     * for MCP transitions (the web app sends them from the browser).
     * Best-effort: never fails the transition.
     */
    private notify(
        task: any,
        messageKey: keyof typeof notificationMessages,
        recipients: unknown[]
    ) {
        const notificationService = this.notificationService;
        if (!notificationService || !recipients.length) return;
        void (async () => {
            const claim: any = await this.claimService.getById(
                task.target.toString(),
                task.nameSpace
            );
            const baseUrl = this.configService?.get<string>("baseUrl") ?? "";
            const payload = {
                messageIdentifier: notificationMessages[messageKey],
                redirectUrl: `${baseUrl}${sentencePath(
                    task.nameSpace,
                    claim,
                    task.data_hash
                )}`,
            };
            await Promise.all(
                recipients.map((id) =>
                    notificationService.sendNotification(String(id), payload)
                )
            );
        })().catch((error) =>
            this.logger.error(
                `Notification "${messageKey}" for ${task.data_hash} failed: ${error}`
            )
        );
    }
}

/**
 * Server-side mirror of the publish checks in
 * src/machines/reviewTask/validation.ts, applied to the stored report.
 */
export function missingPublishFields(reviewData: any): string[] {
    const missing: string[] = [];
    const isBlank = (value: unknown) =>
        Array.isArray(value)
            ? value.length === 0
            : typeof value !== "string" || !value.trim();
    if (isBlank(reviewData.classification)) missing.push("classification");
    if (isBlank(reviewData.summary)) missing.push("summary");
    if (reviewData.classification !== NOT_FACT_CLASSIFICATION) {
        for (const field of ["report", "verification", "questions"]) {
            if (isBlank(reviewData[field])) missing.push(field);
        }
    }
    if (isBlank(reviewData.sources)) missing.push("sources");
    return missing;
}
