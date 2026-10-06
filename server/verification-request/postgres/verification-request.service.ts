import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import {
    and,
    asc,
    desc,
    eq,
    gte,
    ilike,
    inArray,
    lt,
    lte,
    notInArray,
    or,
    sql,
    SQL,
} from "drizzle-orm";
import type {
    AiTaskFieldParams,
    IVerificationRequestService,
    VerificationRequestCreateInput,
    VerificationRequestFilters,
    VerificationRequestListOptions,
} from "../../interfaces/verification-request.service.interface";
import type { IVerificationRequest } from "../../interfaces/verification-request.interface";
import type { ISourceService } from "../../interfaces/source.service.interface";
import type { IGroupService } from "../../interfaces/group.service.interface";
import type { ITopicService } from "../../interfaces/topic.service.interface";
import type { IPersonalityService } from "../../interfaces/personality.service.interface";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { NotImplementedError } from "../../database/errors";
import { rethrowUniqueViolation } from "../../database/postgres/unique-violation";
import { AiTaskService } from "../../ai-task/ai-task.service";
import { CreateAiTaskDto } from "../../ai-task/dto/create-ai-task.dto";
import { VerificationRequestStateMachineService } from "../state-machine/verification-request.state-machine.service";
import { EMBEDDINGS_PROVIDER } from "../../llm/llm.tokens";
import type { EmbeddingsProvider } from "../../llm/llm.types";
import {
    findImpactArea,
    getFallbackImpactArea,
} from "../../topic/constants/impact-areas";
import { toError } from "../../util/error-handling";
import {
    AI_TASK_TIMEOUT,
    EXPECTED_STATES,
    MAX_RETRY_ATTEMPTS,
    VerificationRequestStatus,
} from "../dto/types";
import {
    buildProgress,
    computeDataHash,
    extractSeverity,
    filterValidSources,
    findRemovedIds,
    hashResult,
    nextMissingState,
    runnableMissingStates,
    stalePendingTaskFields,
    STATE_TO_EVENT,
    validateAiTaskResult,
} from "../shared/verification-request.rules";
import { verificationRequest } from "./schema/verification-request.schema";
import type {
    VerificationRequestInsert,
    VerificationRequestRow,
} from "./schema/verification-request.schema";
import { contentGroup } from "../../group/postgres/schema/group.schema";
import { topic } from "../../topic/postgres/schema/topic.schema";
import { personality } from "../../personality/postgres/schema/personality.schema";
import { source } from "../../source/postgres/schema/source.schema";
import { toTopicEntity } from "../../topic/postgres/topic.service";
import { toPersonalityEntity } from "../../personality/postgres/personality.service";
import { toSourceEntity } from "../../source/postgres/source.service";

type PopulateField =
    | "source"
    | "impactArea"
    | "topics"
    | "identifiedData"
    | "group";

const POPULATABLE: PopulateField[] = [
    "source",
    "impactArea",
    "topics",
    "identifiedData",
    "group",
];

const AI_FIELD_COLUMNS = {
    embedding: "embedding",
    identifiedData: "identifiedDataIds",
    topics: "topicIds",
    impactArea: "impactAreaId",
    severity: "severity",
} as const;

const BODY_COLUMNS = {
    content: "content",
    sourceChannel: "sourceChannel",
    reportType: "reportType",
    additionalInfo: "additionalInfo",
    publicationDate: "publicationDate",
    email: "email",
    heardFrom: "heardFrom",
    date: "date",
    rejected: "rejected",
    isSensitive: "isSensitive",
    severity: "severity",
    status: "status",
    embedding: "embedding",
} as const;

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isUuid = (id: any) => typeof id === "string" && UUID_RE.test(id);
const idOf = (x: any): string => String(x?._id ?? x?.id ?? x);
const escapeLike = (str: string) => str.replace(/[\\%_]/g, String.raw`\$&`);
const vectorLiteral = (v: number[]) => `[${v.join(",")}]`;

function localDayBounds(startDate?: string, endDate?: string) {
    let start: Date | undefined;
    let end: Date | undefined;
    if (startDate) {
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
    }
    if (endDate) {
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
    }
    return { start, end };
}

@Injectable()
export class PostgresVerificationRequestService
    implements IVerificationRequestService
{
    private readonly logger = new Logger(
        PostgresVerificationRequestService.name
    );

    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleClient,
        @Inject(forwardRef(() => VerificationRequestStateMachineService))
        private readonly verificationRequestStateService: VerificationRequestStateMachineService,
        @Inject("SourceService")
        private readonly sourceService: ISourceService,
        @Inject("GroupService")
        private readonly groupService: IGroupService,
        private readonly aiTaskService: AiTaskService,
        @Inject("TopicService")
        private readonly topicService: ITopicService,
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService,
        @Inject(EMBEDDINGS_PROVIDER)
        private readonly embeddingsProvider: EmbeddingsProvider
    ) {}

    // History writes are deferred until HistoryService ports (Phase 6), as on
    // personality — docs/postgres-migration-foundation.md §7.

    private toEntity(
        row: VerificationRequestRow,
        populated: Partial<Record<PopulateField, any>> = {},
        withEmbedding = false
    ): IVerificationRequest {
        const {
            dataHash,
            impactAreaId,
            sourceIds,
            groupId,
            topicIds,
            identifiedDataIds,
            embedding,
            ...rest
        } = row;
        const entity: IVerificationRequest = {
            ...rest,
            _id: row.id,
            data_hash: dataHash,
            reportType: row.reportType ?? undefined,
            impactArea:
                "impactArea" in populated
                    ? populated.impactArea
                    : impactAreaId ?? undefined,
            additionalInfo: row.additionalInfo ?? undefined,
            publicationDate: row.publicationDate ?? undefined,
            email: row.email ?? undefined,
            heardFrom: row.heardFrom ?? undefined,
            source: "source" in populated ? populated.source : sourceIds,
            group:
                "group" in populated ? populated.group : groupId ?? undefined,
            rejected: row.rejected ?? undefined,
            isSensitive: row.isSensitive ?? undefined,
            topics: "topics" in populated ? populated.topics : topicIds,
            severity: row.severity ?? undefined,
            identifiedData:
                "identifiedData" in populated
                    ? populated.identifiedData
                    : identifiedDataIds,
            progress: row.progress ?? undefined,
        };
        if (withEmbedding) entity.embedding = embedding;
        return entity;
    }

    private async populate(
        rows: VerificationRequestRow[],
        fields: PopulateField[]
    ): Promise<Partial<Record<PopulateField, any>>[]> {
        const want = new Set(fields);
        const collect = (pick: (r: VerificationRequestRow) => string[]) =>
            Array.from(new Set(rows.flatMap(pick)));

        const topicIds = collect((r) => [
            ...(want.has("topics") ? r.topicIds : []),
            ...(want.has("impactArea") && r.impactAreaId
                ? [r.impactAreaId]
                : []),
        ]);
        const personalityIds = want.has("identifiedData")
            ? collect((r) => r.identifiedDataIds)
            : [];
        const sourceIds = want.has("source") ? collect((r) => r.sourceIds) : [];
        const groupIds = want.has("group")
            ? collect((r) => (r.groupId ? [r.groupId] : []))
            : [];

        const [topics, personalities, sources, groups] = await Promise.all([
            topicIds.length
                ? this.db
                      .select()
                      .from(topic)
                      .where(inArray(topic.id, topicIds))
                : [],
            personalityIds.length
                ? this.db
                      .select()
                      .from(personality)
                      .where(
                          and(
                              inArray(personality.id, personalityIds),
                              eq(personality.isDeleted, false)
                          )
                      )
                : [],
            sourceIds.length
                ? this.db
                      .select()
                      .from(source)
                      .where(inArray(source.id, sourceIds))
                : [],
            groupIds.length
                ? this.db
                      .select()
                      .from(contentGroup)
                      .where(inArray(contentGroup.id, groupIds))
                : [],
        ]);

        const groupContentIds = Array.from(
            new Set(groups.flatMap((g) => g.contentIds))
        );
        const groupContent = groupContentIds.length
            ? await this.db
                  .select()
                  .from(verificationRequest)
                  .where(inArray(verificationRequest.id, groupContentIds))
            : [];

        const topicById = new Map(topics.map((t) => [t.id, toTopicEntity(t)]));
        const personalityById = new Map(
            personalities.map((p) => [p.id, toPersonalityEntity(p)])
        );
        const sourceById = new Map(
            sources.map((s) => [s.id, toSourceEntity(s)])
        );
        const contentById = new Map(
            groupContent.map((r) => [r.id, this.toEntity(r)])
        );
        const groupById = new Map(
            groups.map((g) => [
                g.id,
                {
                    ...g,
                    _id: g.id,
                    content: g.contentIds
                        .map((id) => contentById.get(id))
                        .filter(Boolean),
                    targetId: g.targetId ?? undefined,
                },
            ])
        );
        const pickMany = <T>(ids: string[], map: Map<string, T>) =>
            ids.map((id) => map.get(id)).filter(Boolean) as T[];

        return rows.map((r) => {
            const out: Partial<Record<PopulateField, any>> = {};
            if (want.has("source"))
                out.source = pickMany(r.sourceIds, sourceById);
            if (want.has("topics"))
                out.topics = pickMany(r.topicIds, topicById);
            if (want.has("identifiedData")) {
                out.identifiedData = pickMany(
                    r.identifiedDataIds,
                    personalityById
                );
            }
            if (want.has("impactArea")) {
                out.impactArea = r.impactAreaId
                    ? topicById.get(r.impactAreaId) ?? null
                    : undefined;
            }
            if (want.has("group")) {
                out.group = r.groupId
                    ? groupById.get(r.groupId) ?? null
                    : undefined;
            }
            return out;
        });
    }

    private async toEntities(
        rows: VerificationRequestRow[],
        fields: PopulateField[],
        withEmbedding = false
    ): Promise<IVerificationRequest[]> {
        const populated = await this.populate(rows, fields);
        return rows.map((r, i) =>
            this.toEntity(r, populated[i], withEmbedding)
        );
    }

    private async findRow(id: string): Promise<VerificationRequestRow | null> {
        const [row] = await this.db
            .select()
            .from(verificationRequest)
            .where(eq(verificationRequest.id, id))
            .limit(1);
        return row ?? null;
    }

    private async buildWhere(
        filters: VerificationRequestFilters
    ): Promise<SQL | undefined> {
        const {
            contentFilters,
            topics,
            severity,
            sourceChannel,
            status,
            impactArea,
            startDate,
            endDate,
        } = filters;
        const conditions: SQL[] = [];
        const orConditions: SQL[] = [];

        const [topicsObj, impactAreasObj] = await Promise.all([
            topics?.length ? this.topicService.findByNames(topics) : [],
            impactArea?.length ? this.topicService.findByNames(impactArea) : [],
        ]);
        const topicIds = topicsObj.map((t: any) => idOf(t));
        const impactAreaIds = impactAreasObj.map((t: any) => idOf(t));

        if (topicIds.length) {
            orConditions.push(
                sql`${verificationRequest.topicIds} && ${sql.raw(
                    `ARRAY[${topicIds
                        .map((id) => `'${id}'`)
                        .join(",")}]::uuid[]`
                )}`
            );
        }
        if (impactAreaIds.length) {
            orConditions.push(
                inArray(verificationRequest.impactAreaId, impactAreaIds)
            );
        }
        for (const filter of contentFilters ?? []) {
            orConditions.push(
                ilike(verificationRequest.content, `%${escapeLike(filter)}%`)
            );
        }
        if (orConditions.length) conditions.push(or(...orConditions)!);

        const { start, end } = localDayBounds(startDate, endDate);
        if (start) conditions.push(gte(verificationRequest.date, start));
        if (end) conditions.push(lte(verificationRequest.date, end));

        if (severity && severity !== "all") {
            conditions.push(
                severity === "critical"
                    ? eq(verificationRequest.severity, "critical")
                    : ilike(
                          verificationRequest.severity,
                          `${escapeLike(severity)}%`
                      )
            );
        }
        if (sourceChannel && sourceChannel !== "all") {
            const channels = Array.isArray(sourceChannel)
                ? sourceChannel
                : [sourceChannel];
            conditions.push(
                inArray(verificationRequest.sourceChannel, channels)
            );
        }
        if (status?.length) {
            conditions.push(inArray(verificationRequest.status, status));
        }
        return conditions.length ? and(...conditions) : undefined;
    }

    async listAll({
        page,
        pageSize,
        order,
        ...filters
    }: VerificationRequestListOptions): Promise<IVerificationRequest[]> {
        const size = parseInt(String(pageSize), 10);
        const offset = page * size;
        if (!Number.isFinite(size) || !Number.isFinite(offset)) {
            throw new BadRequestException("Invalid page or pageSize");
        }
        const direction = order === "asc" || order === 1 ? asc : desc;
        const where = await this.buildWhere(filters);
        const rows = await this.db
            .select()
            .from(verificationRequest)
            .where(where)
            .orderBy(
                direction(verificationRequest.createdAt),
                direction(verificationRequest.id)
            )
            .offset(offset)
            .limit(size);
        return this.toEntities(rows, [
            "source",
            "impactArea",
            "topics",
            "identifiedData",
        ]);
    }

    async findAll(query: {
        searchContent?: string;
    }): Promise<IVerificationRequest[]> {
        const rows = await this.db
            .select()
            .from(verificationRequest)
            .where(
                ilike(
                    verificationRequest.content,
                    `%${escapeLike(query.searchContent || "")}%`
                )
            )
            .orderBy(
                asc(verificationRequest.createdAt),
                asc(verificationRequest.id)
            );
        return this.toEntities(rows, ["source"]);
    }

    async findBySourceUrl(
        sourceUrl: string,
        options?: { page?: number; pageSize?: number }
    ): Promise<IVerificationRequest[]> {
        const pageSize = options?.pageSize || 10;
        const src = await this.sourceService.getSourceByHref(sourceUrl);
        if (!src) return [];
        const rows = await this.db
            .select()
            .from(verificationRequest)
            .where(
                sql`${verificationRequest.sourceIds} @> ARRAY[${idOf(
                    src
                )}]::uuid[]`
            )
            .orderBy(
                desc(verificationRequest.date),
                desc(verificationRequest.id)
            )
            .limit(pageSize);
        return this.toEntities(rows, ["source"]);
    }

    async getById(id: string): Promise<IVerificationRequest | null> {
        const row = await this.findRow(id);
        if (!row) return null;
        const [entity] = await this.toEntities([row], ["group"]);
        return entity;
    }

    async getByIdWithPopulatedFields(
        id: string,
        fieldsToPopulate: string[] = []
    ): Promise<IVerificationRequest | null> {
        const unknown = fieldsToPopulate.filter(
            (f) => !POPULATABLE.includes(f as PopulateField)
        );
        if (unknown.length) {
            throw new NotImplementedError(
                "postgres",
                `getByIdWithPopulatedFields(${unknown.join(",")})`
            );
        }
        const row = await this.findRow(id);
        if (!row) return null;
        const [entity] = await this.toEntities(
            [row],
            fieldsToPopulate as PopulateField[]
        );
        return entity;
    }

    private rethrowCreateError(error: unknown): never {
        const err = toError(error) as any;
        this.logger.error("Failed to create verification request", err.stack);
        if (err?.code === "23502" && err?.column) {
            const field = String(err.column).replace(
                /_([a-z])/g,
                (_: string, c: string) => c.toUpperCase()
            );
            throw new BadRequestException(
                `Validation failed: ${field} are invalid or missing`
            );
        }
        try {
            rethrowUniqueViolation(error, "verification_request");
        } catch (mapped: any) {
            if (mapped?.fields) {
                throw new BadRequestException(
                    `Duplicate value for field: ${mapped.fields[0]}`
                );
            }
        }
        throw new BadRequestException("Failed to create verification request");
    }

    private bodyPatch(
        body: Record<string, any>
    ): Partial<VerificationRequestInsert> {
        const patch: Record<string, any> = {};
        for (const [key, column] of Object.entries(BODY_COLUMNS)) {
            if (body[key] !== undefined) patch[column] = body[key];
        }
        if (body.topics !== undefined) {
            patch.topicIds = (body.topics ?? []).map(idOf);
        }
        if (body.identifiedData !== undefined) {
            patch.identifiedDataIds = (body.identifiedData ?? []).map(idOf);
        }
        if (body.statesExecuted !== undefined)
            patch.statesExecuted = body.statesExecuted;
        if (typeof body.date === "string") patch.date = new Date(body.date);
        return patch;
    }

    async create(
        data: VerificationRequestCreateInput,
        _user?: any
    ): Promise<IVerificationRequest> {
        try {
            this.logger.debug("Creating verification request", { data });
            const dataHash = data.data_hash || computeDataHash(data.content);
            let row: VerificationRequestRow;
            try {
                [row] = await this.db
                    .insert(verificationRequest)
                    .values({
                        ...this.bodyPatch(data),
                        dataHash,
                        embedding: null,
                        sourceIds: [],
                        impactAreaId: null,
                    } as VerificationRequestInsert)
                    .returning();
            } catch (error) {
                this.rethrowCreateError(error);
            }

            const validSources = filterValidSources(data.source);
            if (validSources.length) {
                const sourceIds = await Promise.all(
                    validSources.map(async (s) => {
                        const src = await this.sourceService.create({
                            href: s.href,
                            targetId: row.id,
                        });
                        return idOf(src);
                    })
                );
                [row] = await this.db
                    .update(verificationRequest)
                    .set({ sourceIds, updatedAt: new Date() })
                    .where(eq(verificationRequest.id, row.id))
                    .returning();
            }

            if (data.impactArea) {
                const impactArea = findImpactArea(data.impactArea);
                if (impactArea) {
                    const found = await this.topicService.findOrCreateTopic(
                        impactArea
                    );
                    [row] = await this.db
                        .update(verificationRequest)
                        .set({
                            impactAreaId: idOf(found),
                            updatedAt: new Date(),
                        })
                        .where(eq(verificationRequest.id, row.id))
                        .returning();
                } else {
                    this.logger.warn(
                        `Ignoring impact area outside the closed list: ${JSON.stringify(
                            data.impactArea
                        )}`
                    );
                }
            }

            this.logger.log(
                `Verification request created successfully: ${row.id}`
            );
            return this.toEntity(row, {}, true);
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            this.rethrowCreateError(error);
        }
    }

    async createAiTask(taskDto: CreateAiTaskDto) {
        const targetId = taskDto.callbackParams?.targetId;
        const field = taskDto.callbackParams?.field;

        if (!targetId || !field) {
            this.logger.log(
                `Creating AI task without tracking: ${taskDto.type}`,
                {
                    taskDto,
                }
            );
            await this.aiTaskService.create(taskDto);
            return { success: true };
        }

        const vr = await this.findRow(targetId);
        if (!vr) {
            throw new BadRequestException(
                `VerificationRequest ${targetId} not found`
            );
        }
        const existingTaskId = vr.pendingAiTasks?.[field];
        if (existingTaskId) {
            this.logger.log(
                `AI task already exists for ${field} on VR ${targetId}: ${existingTaskId}. Skipping creation.`
            );
            return { success: true, skipped: true, existingTaskId };
        }

        this.logger.log(
            `Creating AI task: ${taskDto.type} for VR ${targetId}`,
            {
                taskDto,
            }
        );
        const task = await this.aiTaskService.create(taskDto);
        await this.db
            .update(verificationRequest)
            .set({
                pendingAiTasks: sql`${
                    verificationRequest.pendingAiTasks
                } || ${JSON.stringify({
                    [field]: task._id.toString(),
                })}::jsonb`,
                updatedAt: new Date(),
            })
            .where(eq(verificationRequest.id, targetId));
        this.logger.log(
            `Tracked AI task ${task._id} for field ${field} on VR ${targetId}`
        );
        return { success: true, taskId: task._id };
    }

    async updateFieldByAiTask(
        params: AiTaskFieldParams,
        result: any
    ): Promise<IVerificationRequest> {
        const startTime = Date.now();
        const { targetId, field } = params;
        this.logger.log(
            `[updateFieldByAiTask] Updating VR ${targetId} for field: ${field}`
        );

        try {
            const current = await this.findRow(targetId);
            if (!current) {
                throw new BadRequestException(
                    `VerificationRequest ${targetId} not found`
                );
            }

            const resultHash = hashResult(result);
            if (current.stateFingerprints?.[field] === resultHash) {
                this.logger.log(
                    `Duplicate ${field} update detected for ${targetId}, skipping`
                );
                return this.toEntity(current, {}, true);
            }

            let valueToUpdate: any;
            switch (field) {
                case "embedding":
                    valueToUpdate = result;
                    break;
                case "identifiedData":
                    if (
                        result?.personalities &&
                        Array.isArray(result.personalities)
                    ) {
                        valueToUpdate = await Promise.all(
                            result.personalities.map(
                                async (p: { name: string; wikidata?: any }) =>
                                    idOf(
                                        await this.personalityService.findOrCreatePersonality(
                                            {
                                                name: p.name,
                                                wikidata: p.wikidata,
                                            }
                                        )
                                    )
                            )
                        );
                    } else {
                        this.logger.warn(
                            "No personalities identified or unexpected format, setting empty array"
                        );
                        valueToUpdate = [];
                    }
                    break;
                case "topics":
                    if (!Array.isArray(result)) {
                        throw new BadRequestException(
                            `Topics must be an array, got: ${typeof result}`
                        );
                    }
                    valueToUpdate = await Promise.all(
                        result.map(async (topicData: any) =>
                            idOf(
                                await this.topicService.findOrCreateTopic(
                                    topicData
                                )
                            )
                        )
                    );
                    break;
                case "impactArea": {
                    let impactArea = findImpactArea(result);
                    if (!impactArea) {
                        this.logger.warn(
                            `Impact area outside the closed list, using fallback: ${JSON.stringify(
                                result
                            )}`
                        );
                        impactArea = getFallbackImpactArea();
                    }
                    valueToUpdate = idOf(
                        await this.topicService.findOrCreateTopic(impactArea)
                    );
                    break;
                }
                case "severity":
                    valueToUpdate = extractSeverity(result);
                    if (valueToUpdate === undefined) {
                        throw new BadRequestException(
                            `Invalid severity result format: ${JSON.stringify(
                                result
                            )}`
                        );
                    }
                    break;
                default:
                    throw new BadRequestException(`Invalid field: ${field}`);
            }

            const validation = validateAiTaskResult(
                field,
                valueToUpdate,
                isUuid
            );
            if (!validation.valid) {
                await this.handleInvalidResult(
                    targetId,
                    field,
                    validation.error ?? ""
                );
                throw new BadRequestException(
                    `Invalid ${field} result: ${validation.error}`
                );
            }

            const column =
                AI_FIELD_COLUMNS[field as keyof typeof AI_FIELD_COLUMNS];
            const [updated] = await this.db
                .update(verificationRequest)
                .set({
                    [column]: valueToUpdate,
                    stateFingerprints: sql`${
                        verificationRequest.stateFingerprints
                    } || ${JSON.stringify({ [field]: resultHash })}::jsonb`,
                    statesExecuted: this.appendUnique(field),
                    pendingAiTasks: sql`${verificationRequest.pendingAiTasks} - ${field}`,
                    ...(field === "severity"
                        ? { status: VerificationRequestStatus.IN_TRIAGE }
                        : {}),
                    updatedAt: new Date(),
                })
                .where(eq(verificationRequest.id, targetId))
                .returning();
            if (!updated) {
                throw new BadRequestException(
                    `Verification request ${targetId} not found after update`
                );
            }

            const fromState = current.statesExecuted?.slice(-1)[0] || "initial";
            await this.trackStateTransition(
                updated.id,
                fromState,
                field,
                Date.now() - startTime
            );
            const afterTransition = (await this.findRow(updated.id)) ?? updated;
            await this.updateProgress(afterTransition);
            await this.revalidateAndRunMissingStatesWithParallel(
                this.toEntity(updated)
            );
            return this.toEntity(updated, {}, true);
        } catch (error) {
            const err = toError(error);
            await this.handleStateError(targetId, field, err.message);
            throw error;
        }
    }

    private appendUnique(state: string): SQL {
        return sql`CASE WHEN ${state} = ANY(${verificationRequest.statesExecuted}) THEN ${verificationRequest.statesExecuted} ELSE array_append(${verificationRequest.statesExecuted}, ${state}) END`;
    }

    private pendingFields(vr: IVerificationRequest): string[] {
        const pending = vr.pendingAiTasks;
        if (!pending) return [];
        return pending instanceof Map
            ? Array.from(pending.keys())
            : Object.keys(pending);
    }

    async revalidateAndRunMissingStates(
        vr: IVerificationRequest
    ): Promise<void> {
        const statesExecuted = vr.statesExecuted || [];
        const pending = this.pendingFields(vr);
        this.logger.log(
            `[revalidateAndRunMissingStates] VR ${idOf(
                vr
            )}, states executed: ${statesExecuted.join(
                ", "
            )}, pending: ${pending.join(", ")}`
        );
        const state = nextMissingState(statesExecuted, (s) =>
            pending.includes(s)
        );
        if (!state) {
            this.logger.log(
                `All states completed for VR ${idOf(vr)}, status is IN_TRIAGE`
            );
            return;
        }
        this.logger.log(
            `Missing state found: ${state}, triggering state machine`
        );
        await this.triggerStateMachineForMissingState(vr, state);
    }

    async triggerStateMachineForMissingState(
        vr: IVerificationRequest,
        missingState: string
    ): Promise<void> {
        const event = STATE_TO_EVENT[missingState];
        if (!event) {
            this.logger.warn(
                `No event mapping found for state: ${missingState}`
            );
            return;
        }
        try {
            await (this.verificationRequestStateService as any)[event](
                idOf(vr)
            );
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Failed to trigger state machine for ${missingState}: ${err.message}`,
                err.stack
            );
        }
    }

    async findByDataHash(
        dataHash: string,
        populate = true
    ): Promise<IVerificationRequest | null> {
        const [row] = await this.db
            .select()
            .from(verificationRequest)
            .where(eq(verificationRequest.dataHash, dataHash))
            .orderBy(
                asc(verificationRequest.createdAt),
                asc(verificationRequest.id)
            )
            .limit(1);
        if (!row) return null;
        const [entity] = await this.toEntities(
            [row],
            populate ? POPULATABLE : [],
            true
        );
        return entity;
    }

    findRemovedIds(
        initial: { content: any[] },
        updated: { content: string[] }
    ): string[] {
        return findRemovedIds(initial, updated);
    }

    async removeVerificationRequestFromGroup(
        id: string,
        groupId: string
    ): Promise<IVerificationRequest> {
        try {
            const row = await this.findRow(id);
            if (!row) {
                throw new BadRequestException(
                    `Verification request ${id} not found`
                );
            }
            await this.groupService.removeContent(groupId, row.id);
            const [updated] = await this.db
                .update(verificationRequest)
                .set({ groupId: null, updatedAt: new Date() })
                .where(eq(verificationRequest.id, row.id))
                .returning();
            return this.toEntity(updated, {}, true);
        } catch (error) {
            this.logger.error(
                "Failed to remove verification request from group:",
                error
            );
            throw error;
        }
    }

    async update(
        id: string,
        body: Record<string, any>,
        postProcess = true
    ): Promise<IVerificationRequest> {
        try {
            const row = await this.findRow(idOf(id));
            if (!row) {
                throw new NotFoundException("Verification request not found");
            }
            const [original] = await this.toEntities([row], ["group"]);
            const patch: Record<string, any> = {
                ...this.bodyPatch(body),
                publicationDate: body.publicationDate ?? row.publicationDate,
                updatedAt: new Date(),
            };

            if (body.source?.length) {
                patch.sourceIds = await Promise.all(
                    body.source.map(async (s: { href: string }) =>
                        idOf(
                            await this.sourceService.create({
                                href: s.href,
                                targetId: row.id,
                            })
                        )
                    )
                );
            }

            if (body.impactArea !== undefined) {
                patch.impactAreaId = body.impactArea
                    ? idOf(body.impactArea)
                    : null;
            }

            if (body.group !== undefined) {
                if (postProcess && Array.isArray(body.group)) {
                    patch.groupId = idOf(
                        await this.handleGroupPostProcessing(
                            original,
                            body.group
                        )
                    );
                } else if (Array.isArray(body.group)) {
                    throw new NotImplementedError(
                        "postgres",
                        "update(group[] without postProcess)"
                    );
                } else {
                    patch.groupId = body.group ? idOf(body.group) : null;
                }
            }

            const [updated] = await this.db
                .update(verificationRequest)
                .set(patch)
                .where(eq(verificationRequest.id, row.id))
                .returning();
            const [entity] = await this.toEntities(
                [updated],
                ["source", "impactArea"],
                true
            );
            return entity;
        } catch (error) {
            this.logger.error("Failed to update verification request:", error);
            throw error;
        }
    }

    private async handleGroupPostProcessing(
        original: IVerificationRequest,
        group: any[]
    ) {
        if (original.group) {
            await this.delete(original, group);
        }
        return this.createGroupAndUpdateVerificationRequests(original, group);
    }

    private async delete(original: IVerificationRequest, group: any[]) {
        const removed = findRemovedIds(
            { content: (original.group?.content ?? []).map(idOf) },
            { content: [idOf(original), ...group.map(idOf)] }
        );
        if (removed.length) {
            await Promise.all(
                removed.map((rid) => this.update(rid, { group: null }, false))
            );
        }
    }

    private async createGroupAndUpdateVerificationRequests(
        original: IVerificationRequest,
        group: any[]
    ) {
        const contentIds = group.map(idOf);
        const groupId = idOf(
            await this.groupService.create({
                content: [idOf(original), ...contentIds],
            })
        );
        if (contentIds.length) {
            await Promise.all(
                contentIds.map((itemId) =>
                    this.update(itemId, { group: groupId }, false)
                )
            );
        }
        return groupId;
    }

    async count(filters: VerificationRequestFilters): Promise<number> {
        const where = await this.buildWhere(filters);
        const [{ value }] = await this.db
            .select({ value: sql<number>`count(*)::int` })
            .from(verificationRequest)
            .where(where);
        return value;
    }

    createEmbedContent(content: string): Promise<number[]> {
        return this.embeddingsProvider.getEmbeddings().embedQuery(content);
    }

    async findSimilarRequests(
        queryEmbedding: number[],
        filter: string[],
        pageSize: number | string
    ): Promise<IVerificationRequest[]> {
        if (!queryEmbedding || queryEmbedding.length === 0) return [];
        const limit = parseInt(String(pageSize), 10);
        if (!Number.isFinite(limit)) {
            throw new BadRequestException("Invalid pageSize");
        }
        const vec = sql`${vectorLiteral(queryEmbedding)}::vector`;
        const similarity = sql<number>`-(${verificationRequest.embedding} <#> ${vec})`;
        const conditions: SQL[] = [
            sql`${verificationRequest.embedding} IS NOT NULL`,
            sql`${similarity} >= 0.8`,
        ];
        if (filter.length) {
            conditions.push(
                notInArray(verificationRequest.id, filter.map(idOf))
            );
        }
        const rows = await this.db
            .select({ row: verificationRequest, similarity })
            .from(verificationRequest)
            .where(and(...conditions))
            .orderBy(desc(similarity), asc(verificationRequest.id))
            .limit(limit);
        const entities = await this.toEntities(
            rows.map((r) => r.row),
            ["source"]
        );
        return entities.map((e, i) => ({
            ...e,
            similarity: rows[i].similarity,
        }));
    }

    async updateVerificationRequestWithTopics(
        topics: Array<{ value?: string; wikidataId?: string }>,
        dataHash: string
    ): Promise<IVerificationRequest | null> {
        const existing = await this.findByDataHash(dataHash, false);
        if (!existing) return null;
        const found = await this.topicService.findByWikidataIds(
            topics.map((t) => (t.value || t.wikidataId)!)
        );
        const [updated] = await this.db
            .update(verificationRequest)
            .set({ topicIds: found.map(idOf), updatedAt: new Date() })
            .where(eq(verificationRequest.id, idOf(existing)))
            .returning();
        return this.toEntity(updated, {}, true);
    }

    private async handleInvalidResult(
        vrId: string,
        state: string,
        error: string
    ) {
        this.logger.error(
            `Invalid result for VR ${vrId}, state ${state}: ${error}`
        );
        const retries = await this.incrementRetryCount(vrId, state);
        if (retries >= MAX_RETRY_ATTEMPTS) {
            await this.markForManualReview(vrId, state, error);
        }
    }

    private async incrementRetryCount(
        vrId: string,
        state: string
    ): Promise<number> {
        const vr = await this.findRow(vrId);
        if (!vr) return 0;
        const retries = (vr.stateRetries?.[state] || 0) + 1;
        await this.db
            .update(verificationRequest)
            .set({
                stateRetries: sql`${
                    verificationRequest.stateRetries
                } || ${JSON.stringify({ [state]: retries })}::jsonb`,
                updatedAt: new Date(),
            })
            .where(eq(verificationRequest.id, vrId));
        return retries;
    }

    private appendJson(
        column: SQL.Aliased | any,
        entry: Record<string, any>
    ): SQL {
        return sql`${column} || ${JSON.stringify([entry])}::jsonb`;
    }

    private async markForManualReview(
        vrId: string,
        state: string,
        reason: string
    ) {
        this.logger.warn(
            `Marking VR ${vrId} for manual review. State: ${state}, Reason: ${reason}`
        );
        await this.db
            .update(verificationRequest)
            .set({
                auditLog: this.appendJson(verificationRequest.auditLog, {
                    action: "manual_review_required",
                    field: state,
                    timestamp: new Date(),
                    details: { reason, maxRetriesExceeded: true },
                }),
                status: "Manual Review Required",
                updatedAt: new Date(),
            })
            .where(eq(verificationRequest.id, vrId));
    }

    private async handleStateError(vrId: string, state: string, error: string) {
        this.logger.error(`Error in state ${state} for VR ${vrId}: ${error}`);
        if (!isUuid(vrId)) return;
        await this.db
            .update(verificationRequest)
            .set({
                stateErrors: this.appendJson(verificationRequest.stateErrors, {
                    state,
                    error,
                    timestamp: new Date(),
                }),
                updatedAt: new Date(),
            })
            .where(eq(verificationRequest.id, vrId));
    }

    private async trackStateTransition(
        vrId: string,
        from: string,
        to: string,
        duration: number
    ) {
        await this.db
            .update(verificationRequest)
            .set({
                stateTransitions: this.appendJson(
                    verificationRequest.stateTransitions,
                    {
                        from,
                        to,
                        timestamp: new Date(),
                        duration,
                    }
                ),
                updatedAt: new Date(),
            })
            .where(eq(verificationRequest.id, vrId));
        this.logger.log(
            `State transition: ${from} -> ${to} in ${duration}ms for VR ${vrId}`
        );
    }

    private async updateProgress(vr: VerificationRequestRow) {
        await this.db
            .update(verificationRequest)
            .set({
                progress: buildProgress(
                    vr.statesExecuted || [],
                    vr.stateTransitions || []
                ),
                updatedAt: new Date(),
            })
            .where(eq(verificationRequest.id, vr.id));
    }

    private async revalidateAndRunMissingStatesWithParallel(
        vr: IVerificationRequest
    ) {
        const statesExecuted = vr.statesExecuted || [];
        this.logger.log(
            `Revalidating VR ${idOf(
                vr
            )}, states executed: ${statesExecuted.join(", ")}`
        );
        const missing = runnableMissingStates(statesExecuted);
        if (!missing.length) {
            this.logger.log(`No runnable missing states for VR ${idOf(vr)}`);
            return;
        }
        for (const state of missing) {
            this.logger.log(
                `Triggering state machine for missing state: ${state} on VR ${idOf(
                    vr
                )}`
            );
            await this.triggerStateMachineForMissingState(vr, state);
        }
    }

    async checkAndRetryStaleAiTasks(): Promise<void> {
        const rows = await this.db
            .select()
            .from(verificationRequest)
            .where(
                and(
                    eq(
                        verificationRequest.status,
                        VerificationRequestStatus.PRE_TRIAGE
                    ),
                    lt(
                        verificationRequest.updatedAt,
                        new Date(Date.now() - AI_TASK_TIMEOUT)
                    ),
                    sql`cardinality(${verificationRequest.statesExecuted}) < ${EXPECTED_STATES.length}`
                )
            );
        this.logger.log(`Found ${rows.length} stale verification requests`);
        for (const row of rows) {
            this.logger.log(`Retrying stale request: ${row.id}`);
            await this.clearStalePendingTasks(row);
            await this.revalidateAndRunMissingStates(this.toEntity(row));
        }
    }

    private async clearStalePendingTasks(vr: VerificationRequestRow) {
        const pendingFields = Object.keys(vr.pendingAiTasks ?? {});
        if (!pendingFields.length) return;
        const toClean = stalePendingTaskFields(
            pendingFields,
            vr.statesExecuted ?? [],
            vr.updatedAt ?? vr.date,
            AI_TASK_TIMEOUT
        );
        if (!toClean.length) return;
        await this.db
            .update(verificationRequest)
            .set({
                pendingAiTasks: sql`${
                    verificationRequest.pendingAiTasks
                } - ${sql.raw(
                    `ARRAY[${toClean.map((f) => `'${f}'`).join(",")}]::text[]`
                )}`,
                updatedAt: new Date(),
            })
            .where(eq(verificationRequest.id, vr.id));
        this.logger.log(
            `Cleaned ${toClean.length} stale pending tasks for VR ${vr.id}`
        );
    }

    async manualOverrideField(
        id: string,
        field: string,
        value: any,
        userId: string
    ): Promise<IVerificationRequest> {
        this.logger.log(
            `Manual override: VR ${id}, field ${field} by user ${userId}`
        );
        const vr = await this.findRow(id);
        if (!vr) {
            throw new BadRequestException(
                `VerificationRequest ${id} not found`
            );
        }
        const column =
            AI_FIELD_COLUMNS[field as keyof typeof AI_FIELD_COLUMNS] ??
            BODY_COLUMNS[field as keyof typeof BODY_COLUMNS];
        if (!column) {
            throw new NotImplementedError(
                "postgres",
                `manualOverrideField(${field})`
            );
        }
        const [updated] = await this.db
            .update(verificationRequest)
            .set({
                [column]: value,
                statesExecuted: this.appendUnique(field),
                auditLog: this.appendJson(verificationRequest.auditLog, {
                    action: "manual_override",
                    field,
                    userId,
                    timestamp: new Date(),
                    details: { value },
                }),
                updatedAt: new Date(),
            })
            .where(eq(verificationRequest.id, id))
            .returning();
        if (!updated) {
            throw new BadRequestException(
                `VerificationRequest ${id} not found after update`
            );
        }
        const entity = this.toEntity(updated, {}, true);
        await this.revalidateAndRunMissingStates(entity);
        return entity;
    }

    async cascadeUpdateDataHash(
        oldHash: string,
        newHash: string,
        session?: unknown
    ): Promise<number> {
        if (session !== undefined) {
            throw new NotImplementedError(
                "postgres",
                "cascadeUpdateDataHash(session)"
            );
        }
        const updated = await this.db
            .update(verificationRequest)
            .set({ dataHash: newHash, updatedAt: new Date() })
            .where(eq(verificationRequest.dataHash, oldHash))
            .returning({ id: verificationRequest.id });
        return updated.length;
    }
}
