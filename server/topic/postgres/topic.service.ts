import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
} from "@nestjs/common";
import { and, asc, eq, ilike, inArray, or, sql, SQL } from "drizzle-orm";
import type {
    ITopicService,
    TopicCreateInput,
    TopicRef,
} from "../../interfaces/topic.service.interface";
import { ITopic } from "../../interfaces/topic.interface";
import type { ISentenceService } from "../../interfaces/sentence.service.interface";
import { ContentModelEnum } from "../../types/enums";
import { TopicData } from "../types/topic.interfaces";
import { ImpactArea } from "../constants/impact-areas";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { NotImplementedError } from "../../database/errors";
import { rethrowUniqueViolation } from "../../database/postgres/unique-violation";
import { WikidataService } from "../../wikidata/wikidata.service";
import { toError } from "../../util/error-handling";
import {
    buildTopicFromInput,
    buildTopicFromTopicData,
    DEFAULT_TOPIC_LANGUAGE,
    deriveTopicSlug,
    findMatchedAlias,
    listImpactAreas,
    normalizeText,
    toExistingTopicRef,
    topicInputSlugSource,
} from "../shared/topic.rules";
import { topic } from "./schema/topic.schema";
import type { TopicInsert, TopicRow } from "./schema/topic.schema";

/** Escape LIKE metacharacters so the query matches literally. */
function escapeLike(str: string): string {
    return str.replace(/[\\%_]/g, String.raw`\$&`);
}

export function toTopicEntity(row: TopicRow): ITopic {
    // wikidata_id NULL surfaces as undefined, like an absent Mongo field.
    return {
        ...row,
        _id: row.id,
        wikidataId: row.wikidataId ?? undefined,
    } as unknown as ITopic;
}

@Injectable()
export class PostgresTopicService implements ITopicService {
    private readonly logger = new Logger(PostgresTopicService.name);

    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleClient,
        private readonly wikidataService: WikidataService,
        @Inject("SentenceService")
        private readonly sentenceService: ISentenceService
    ) {}

    /**
     * Boundary mapper (§2): raw row → the entity shape callers expect,
     * exposing `_id` (Mongo-parity alias callers read) alongside `id`.
     */
    private toEntity(row: TopicRow): ITopic {
        return toTopicEntity(row);
    }

    /** SQLSTATE 23505 → neutral DuplicateKeyError (shared infra). */
    private rethrowMapped(error: unknown): never {
        rethrowUniqueViolation(error, "topic");
    }

    /** Any alias element matches the predicate built on `alias`. */
    private anyAlias(predicate: SQL): SQL {
        return sql`EXISTS (SELECT 1 FROM unnest(${topic.aliases}) AS alias WHERE ${predicate})`;
    }

    private async findBySlug(slug: string): Promise<TopicRow | null> {
        const [row] = await this.db
            .select()
            .from(topic)
            .where(and(eq(topic.slug, slug), eq(topic.isDeleted, false)))
            .limit(1);
        return row ?? null;
    }

    private async insertTopic(values: TopicInsert): Promise<TopicRow> {
        try {
            const [row] = await this.db
                .insert(topic)
                .values(values)
                .returning();
            return row;
        } catch (error) {
            this.rethrowMapped(error);
        }
    }

    async getWikidataEntities(regex: string, language: string) {
        return await this.wikidataService.queryWikibaseEntities(
            regex,
            language
        );
    }

    async searchTopics(
        query: string,
        language = DEFAULT_TOPIC_LANGUAGE,
        limit = 10
    ): Promise<any> {
        if (typeof language !== "string") {
            throw new TypeError("Invalid language");
        }
        const size = Number(limit);
        if (!Number.isFinite(size)) {
            throw new NotImplementedError(
                "postgres",
                "searchTopics(limit=NaN)"
            );
        }

        // Mongo feeds the (unescaped) query to $regex; here it is a literal
        // case-insensitive substring match (documented divergence).
        const normalizedQuery = normalizeText(query);
        const pattern = `%${escapeLike(normalizedQuery)}%`;

        const rows = await this.db
            .select()
            .from(topic)
            .where(
                and(
                    eq(topic.language, language),
                    eq(topic.isDeleted, false),
                    or(
                        ilike(topic.name, pattern),
                        this.anyAlias(sql`alias ILIKE ${pattern}`)
                    )
                )
            )
            .orderBy(asc(topic.name))
            .limit(size);

        const normalizedQueryLower = normalizedQuery.toLowerCase();
        return rows.map((row) => ({
            ...this.toEntity(row),
            matchedAlias: findMatchedAlias(row.aliases, normalizedQueryLower),
        }));
    }

    async findAll(
        getTopics: { topicName: string },
        language = DEFAULT_TOPIC_LANGUAGE
    ) {
        return this.getWikidataEntities(getTopics.topicName, language);
    }

    async create(
        { contentModel, topics, data_hash }: TopicCreateInput,
        language: string = DEFAULT_TOPIC_LANGUAGE
    ): Promise<any> {
        if (contentModel === ContentModelEnum.Image) {
            throw new NotImplementedError(
                "postgres",
                `create(contentModel=${contentModel})`
            );
        }
        try {
            // Sequential on purpose: Mongo's Promise.all races duplicate
            // entries in one batch into E11000; here the second entry finds
            // the first (documented divergence).
            const createdTopics: TopicRef[] = [];
            for (const input of topics) {
                const slug = deriveTopicSlug(topicInputSlugSource(input));
                const existing = await this.findBySlug(slug);
                if (existing) {
                    createdTopics.push(
                        toExistingTopicRef(this.toEntity(existing))
                    );
                    continue;
                }
                const draft = buildTopicFromInput(input, slug, language);
                if (typeof draft.name !== "string") {
                    // Mongo: CastError → 500. An object without a label has
                    // no usable name.
                    throw new BadRequestException("Invalid topic name");
                }
                const created = await this.insertTopic({
                    name: draft.name,
                    slug: draft.slug,
                    language: draft.language,
                    wikidataId: draft.wikidataId ?? null,
                    aliases: draft.aliases,
                });
                createdTopics.push({
                    id: created.id,
                    label: created.name,
                    value: created.wikidataId ?? undefined,
                });
            }
            if (contentModel) {
                return this.sentenceService.updateSentenceWithTopics(
                    createdTopics,
                    data_hash!
                );
            }
            return createdTopics;
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Failed to create topics or update related content: ${err.message}`,
                err.stack
            );
            throw error;
        }
    }

    async getBySlug(slug: string): Promise<ITopic | null> {
        const row = await this.findBySlug(slug);
        return row ? this.toEntity(row) : null;
    }

    getImpactAreas(): Pick<ImpactArea, "name" | "slug">[] {
        return listImpactAreas();
    }

    async findByNames(names: string[]): Promise<ITopic[]> {
        // Mongo: `$or: []` is a driver error; live callers guard the empty
        // case, so an empty result is the honest answer here.
        if (names.length === 0) return [];
        const lowered = names.map((name) => name.toLowerCase());
        const rows = await this.db
            .select()
            .from(topic)
            .where(
                and(
                    eq(topic.isDeleted, false),
                    or(
                        inArray(sql`lower(${topic.name})`, lowered),
                        this.anyAlias(
                            inArray(sql`lower(alias)`, lowered) as SQL
                        )
                    )
                )
            )
            .orderBy(asc(topic.createdAt), asc(topic.id));
        return rows.map((row) => this.toEntity(row));
    }

    async findByWikidataIds(wikidataIds: string[]): Promise<ITopic[]> {
        // Only real ids can match a text column; Mongo forwards whatever the
        // caller passes (undefined included) to $in.
        const ids = wikidataIds.filter((id) => typeof id === "string");
        if (ids.length === 0) return [];
        const rows = await this.db
            .select()
            .from(topic)
            .where(
                and(eq(topic.isDeleted, false), inArray(topic.wikidataId, ids))
            )
            .orderBy(asc(topic.createdAt), asc(topic.id));
        return rows.map((row) => this.toEntity(row));
    }

    async findOrCreateTopic(topicData: TopicData): Promise<ITopic> {
        try {
            const draft = buildTopicFromTopicData(topicData);
            const existing = await this.findBySlug(draft.slug);
            if (existing) return this.toEntity(existing);
            const created = await this.insertTopic({
                name: draft.name,
                slug: draft.slug,
                language: draft.language,
                wikidataId: draft.wikidataId ?? null,
            });
            return this.toEntity(created);
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Failed to find or create topic for "${topicData?.name}": ${err.message}`,
                err.stack
            );
            throw error;
        }
    }
}
