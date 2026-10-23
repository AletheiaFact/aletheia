import type { INestApplication } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Roles } from "../auth/ability/ability.factory";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import type { ClaimReviewService } from "../claim-review/claim-review.service";
import type { IClaimService } from "../interfaces/claim.service.interface";
import {
    ASSIGNED_VALUE,
    buildClaimContext,
    collectSentenceHashes,
} from "../mcp/review-workflow/machine";
import { ReviewTaskQueueService } from "../review-task/review-task-queue.service";
import {
    ReviewTask,
    ReviewTaskDocument,
} from "../review-task/schemas/review-task.schema";
import { deriveClaimSlug } from "../claim/shared/claim.rules";
import { ReportModelEnum, ReviewTaskTypeEnum } from "../types/enums";
import type { UsersService } from "../users/users.service";
import { seedClaims } from "./seed-data/claims";
import {
    QueueActor,
    queueScenarios,
    queueUsers,
} from "./seed-data/queue";

interface SeedQueueDeps {
    app: INestApplication;
    contextId: any;
    log: (message: string) => void;
    userService: UsersService;
    claimService: IClaimService;
    claimReviewService: ClaimReviewService;
    // Seeded claims by title.
    claims: Map<string, { claimId: string; personalityId: string }>;
    seedUsers: Array<{ email: string; password: string }>;
}

// Placeholder report so a draft passes the publish rules (see
// server/mcp/review-workflow/publish-rules.ts). It says it is not a real
// fact-check, because the sentences belong to real public figures.
function draftReviewData(classification: string, sourceHref: string) {
    return {
        classification,
        summary:
            "<div><p>[Seed] Rascunho de exemplo para testar a fila de tarefas. Não é uma checagem real.</p></div>",
        report: "<div><p>[Seed] Relatório de exemplo, sem análise real da afirmação.</p></div>",
        verification:
            "<div><p>[Seed] Verificação de exemplo, sem fontes consultadas.</p></div>",
        questions: ["A afirmação pode ser confirmada em fontes oficiais?"],
        sources: [
            {
                href: sourceHref,
                props: { field: null, targetText: null, textRange: [0, 0] },
            },
        ],
    };
}

/**
 * Seeds the review-task work queue for the MCP tools next_review_task,
 * next_cross_checking, list_my_review_tasks, claim_review_task,
 * join_review_task, send_to_review and publish_review_task.
 *
 * Idempotent: a task is only moved out of `unassigned` by this seed, and only
 * while it is still `unassigned`, so re-runs never undo real work.
 */
export async function seedReviewQueue(deps: SeedQueueDeps) {
    const { app, contextId, log, userService, claimService, claims } = deps;

    // Who "me" is: the account used with the MCP client.
    const ownerEmail = process.env.SEED_QUEUE_EMAIL || deps.seedUsers[0].email;
    const owner = await userService.getByEmail(ownerEmail);
    if (!owner) {
        log(`Queue seed skipped: user ${ownerEmail} does not exist`);
        return;
    }

    // Reviewer is the smallest role that can use every queue tool.
    const ownerRole: Record<string, string> = (owner.role as any) ?? {};
    const mainRole = ownerRole[NameSpaceEnum.Main];
    if (mainRole !== Roles.Reviewer && mainRole !== Roles.Admin) {
        try {
            await userService.updateUser(owner._id, {
                role: { ...ownerRole, [NameSpaceEnum.Main]: Roles.Reviewer },
            });
            log(`${ownerEmail} is now a reviewer in the main namespace`);
        } catch (e: any) {
            log(
                `Could not make ${ownerEmail} a reviewer (${e.message}); set the role by hand`
            );
        }
    }

    const people: Record<QueueActor, string> = { me: String(owner._id) } as any;
    for (const persona of queueUsers) {
        let user = await userService.getByEmail(persona.email);
        if (!user) {
            try {
                user = await userService.register({
                    name: persona.name,
                    email: persona.email,
                    password: deps.seedUsers[0].password,
                    role: { [NameSpaceEnum.Main]: persona.role },
                    sendAuthDetails: false,
                });
                log(`${persona.email} seeded`);
            } catch (e: any) {
                log(`Error while seeding ${persona.email}: ${e.message}`);
            }
        }
        if (user) people[persona.key] = String(user._id);
    }
    if (!people.ana || !people.bruno) {
        log("Queue seed skipped: helper users are missing");
        return;
    }

    const queue = await app.resolve(ReviewTaskQueueService, contextId, {
        strict: false,
    });
    const taskModel = app.get<Model<ReviewTaskDocument>>(
        getModelToken(ReviewTask.name),
        { strict: false }
    );

    // Queue feed: one `unassigned` task per sentence still without a review.
    let queued = 0;
    const sentenceOf = new Map<string, string>();
    for (const [title, { claimId, personalityId }] of claims) {
        const claim: any = await claimService.getById(
            claimId,
            NameSpaceEnum.Main
        );
        const hashes = collectSentenceHashes(claim);
        sentenceOf.set(title, hashes[0]);
        for (const dataHash of hashes) {
            if (await deps.claimReviewService.getReviewByDataHash(dataHash)) {
                continue;
            }
            const context = buildClaimContext([], claimId);
            context.review.personality = personalityId;
            const inserted = await queue.enqueueUnassigned({
                data_hash: dataHash,
                reportModel: ReportModelEnum.FactChecking,
                reviewTaskType: ReviewTaskTypeEnum.Claim,
                nameSpace: NameSpaceEnum.Main,
                target: claimId,
                machine: { value: "unassigned", context } as any,
            });
            if (inserted) queued++;
        }
    }
    log(`${queued} review tasks queued as unassigned`);

    // Scenarios: move one sentence per claim to the wanted state.
    const toId = (actor?: QueueActor) =>
        actor ? new Types.ObjectId(people[actor]) : null;
    let moved = 0;
    for (const scenario of queueScenarios) {
        const claim = claims.get(scenario.claimTitle.trim());
        const dataHash = sentenceOf.get(scenario.claimTitle.trim());
        if (!claim || !dataHash) {
            log(`Scenario skipped, claim not found: "${scenario.claimTitle}"`);
            continue;
        }
        const context: any = buildClaimContext([], claim.claimId);
        context.review.personality = claim.personalityId;
        context.reviewData.usersId = scenario.assignees.map(toId);
        context.reviewData.reviewerId = toId(scenario.reviewer);
        context.reviewData.crossCheckerId = toId(scenario.crossChecker);
        if (scenario.state !== "assigned") {
            const source = seedClaims.find(
                (c) => deriveClaimSlug(c.title) === deriveClaimSlug(scenario.claimTitle)
            )?.sources[0];
            Object.assign(
                context.reviewData,
                draftReviewData(scenario.classification ?? "unverifiable", source!)
            );
        }
        const value =
            scenario.state === "assigned" ? ASSIGNED_VALUE : scenario.state;
        const result = await taskModel.updateOne(
            { data_hash: dataHash, "machine.value": "unassigned" },
            { $set: { machine: { value, context } } }
        );
        if (result.modifiedCount) {
            moved++;
            log(`Task "${scenario.claimTitle}" -> ${scenario.state} (${scenario.covers})`);
        }
    }
    log(`${moved} review tasks moved out of unassigned`);
}
