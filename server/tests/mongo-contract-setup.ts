import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection, Model, Types } from "mongoose";
import type { ISoftDeletedModel } from "mongoose-softdelete-typescript";
import {
    Personality,
    PersonalityDocument,
    PersonalitySchema,
} from "../personality/mongo/schemas/personality.schema";
import {
    Source,
    SourceDocument,
    SourceSchema,
} from "../source/mongo/schemas/source.schema";
import {
    Topic,
    TopicDocument,
    TopicSchema,
} from "../topic/mongo/schemas/topic.schema";
import {
    Badge,
    BadgeDocument,
    BadgeSchema,
} from "../badge/mongo/schemas/badge.schema";

/**
 * In-process MongoDB for contract tests (the Mongo counterpart of
 * postgres-setup.ts / pglite). Boots one MongoMemoryServer per Vitest worker
 * process, cached at module level — the unit project has no globalSetup, so
 * this is self-contained and runs regardless of DB_TYPE (Decision D4.1:
 * contract tests are never env-gated).
 */

type PersonalityModelType = ISoftDeletedModel<PersonalityDocument> &
    Model<PersonalityDocument>;

let server: MongoMemoryServer | null = null;
let connection: Connection | null = null;
let personalityModel: PersonalityModelType | null = null;
let sourceModel: Model<SourceDocument> | null = null;
let topicModel: Model<TopicDocument> | null = null;
let badgeModel: Model<BadgeDocument> | null = null;

/** One MongoMemoryServer + connection per worker, shared by every module. */
async function getTestConnection(): Promise<Connection> {
    if (connection) return connection;
    server = await MongoMemoryServer.create();
    connection = await mongoose
        .createConnection(server.getUri("contract-tests"))
        .asPromise();
    return connection;
}

export async function getTestPersonalityModel(): Promise<PersonalityModelType> {
    if (personalityModel) return personalityModel;

    const connection = await getTestConnection();

    // getById() populates the "claims" virtual (ref: "Claim"); the ref model
    // must exist on the connection or populate throws MissingSchemaError. A
    // minimal schema is enough — contract tests never create claims.
    connection.model(
        "Claim",
        new mongoose.Schema({
            title: String,
            content: mongoose.Schema.Types.Mixed,
            personalities: [mongoose.Schema.Types.ObjectId],
            isHidden: Boolean,
            isDeleted: Boolean,
            nameSpace: String,
        })
    );

    personalityModel = connection.model<PersonalityDocument>(
        Personality.name,
        PersonalitySchema
    ) as unknown as PersonalityModelType;

    return personalityModel;
}

export async function getTestSourceModel(): Promise<Model<SourceDocument>> {
    if (sourceModel) return sourceModel;
    const connection = await getTestConnection();
    sourceModel = connection.model<SourceDocument>(Source.name, SourceSchema);
    // The unique data_hash index must exist before contract tests exercise
    // dedup behavior (Mongo builds indexes lazily otherwise).
    await sourceModel.init();
    return sourceModel;
}

export async function getTestTopicModel(): Promise<Model<TopicDocument>> {
    if (topicModel) return topicModel;
    const connection = await getTestConnection();
    topicModel = connection.model<TopicDocument>(Topic.name, TopicSchema);
    // The unique slug index must exist before contract tests exercise
    // duplicate behavior (Mongo builds indexes lazily otherwise).
    await topicModel.init();
    return topicModel;
}

export async function getTestBadgeModel(): Promise<Model<BadgeDocument>> {
    if (badgeModel) return badgeModel;
    const connection = await getTestConnection();
    badgeModel = connection.model<BadgeDocument>(Badge.name, BadgeSchema);
    return badgeModel;
}

/** Remove every personality between tests (soft-deleted rows included). */
export async function resetTestPersonalities(): Promise<void> {
    if (!personalityModel) return;
    await personalityModel.deleteMany({});
}

/** Remove every source between tests. */
export async function resetTestSources(): Promise<void> {
    if (!sourceModel) return;
    await sourceModel.deleteMany({});
}

/** Remove every topic between tests. */
export async function resetTestTopics(): Promise<void> {
    if (!topicModel) return;
    await topicModel.deleteMany({});
}

export async function resetTestBadges(): Promise<void> {
    if (!badgeModel) return;
    await badgeModel.deleteMany({});
}

export async function stopTestMongo(): Promise<void> {
    await connection?.close();
    await server?.stop();
    connection = null;
    personalityModel = null;
    sourceModel = null;
    topicModel = null;
    badgeModel = null;
    server = null;
}

/** A syntactically valid ObjectId that matches no document. */
export function missingMongoId(): string {
    return new Types.ObjectId().toString();
}
