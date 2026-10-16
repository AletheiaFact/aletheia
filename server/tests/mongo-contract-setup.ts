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
import {
    Group,
    GroupDocument,
    GroupSchema,
} from "../group/mongo/schemas/group.schema";
import {
    VerificationRequest,
    VerificationRequestDocument,
    VerificationRequestSchema,
} from "../verification-request/mongo/schemas/verification-request.schema";
import {
    Claim,
    ClaimDocument,
    ClaimSchema,
} from "../claim/mongo/schemas/claim.schema";
import {
    ClaimRevision,
    ClaimRevisionDocument,
    ClaimRevisionSchema,
} from "../claim/claim-revision/mongo/schemas/claim-revision.schema";
import {
    Sentence,
    SentenceDocument,
    SentenceSchema,
} from "../claim/types/sentence/mongo/schemas/sentence.schema";
import {
    Paragraph,
    ParagraphDocument,
    ParagraphSchema,
} from "../claim/types/paragraph/mongo/schemas/paragraph.schema";
import {
    Speech,
    SpeechDocument,
    SpeechSchema,
} from "../claim/types/speech/mongo/schemas/speech.schema";
import {
    Unattributed,
    UnattributedDocument,
    UnattributedSchema,
} from "../claim/types/unattributed/mongo/schemas/unattributed.schema";
import { Image, ImageSchema } from "../claim/types/image/schemas/image.schema";
import {
    Debate,
    DebateSchema,
} from "../claim/types/debate/schemas/debate.schema";
import {
    Report,
    ReportDocument,
    ReportSchema,
} from "../report/mongo/schemas/report.schema";

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
let groupModel: Model<GroupDocument> | null = null;
let verificationRequestModel: Model<VerificationRequestDocument> | null = null;
let claimModels: ClaimModels | null = null;

export type ClaimModels = {
    claim: ISoftDeletedModel<ClaimDocument> & Model<ClaimDocument>;
    claimRevision: Model<ClaimRevisionDocument>;
    sentence: Model<SentenceDocument>;
    paragraph: Model<ParagraphDocument>;
    speech: Model<SpeechDocument>;
    unattributed: Model<UnattributedDocument>;
    report: Model<ReportDocument>;
};

/** One MongoMemoryServer + connection per worker, shared by every module. */
async function getTestConnection(): Promise<Connection> {
    if (connection) return connection;
    server = await MongoMemoryServer.create();
    connection = await mongoose
        .createConnection(server.getUri("contract-tests"))
        .asPromise();
    return connection;
}

function ensureClaimModel(connection: Connection) {
    if (connection.models.Claim) return;
    connection.model<ClaimDocument>(Claim.name, ClaimSchema);
}

/** The claim family: claim, revision, the content types and report. */
export async function getTestClaimModels(): Promise<ClaimModels> {
    if (claimModels) return claimModels;
    const connection = await getTestConnection();
    await getTestPersonalityModel();
    await getTestSourceModel();
    await getTestGroupModel();
    ensureClaimModel(connection);
    // The ClaimRevision `content` virtual resolves against every
    // ContentModelEnum model, so image and debate are registered too.
    if (!connection.models.Image) connection.model(Image.name, ImageSchema);
    if (!connection.models.Debate) connection.model(Debate.name, DebateSchema);
    claimModels = {
        claim: connection.models.Claim as ClaimModels["claim"],
        claimRevision: connection.model<ClaimRevisionDocument>(
            ClaimRevision.name,
            ClaimRevisionSchema
        ),
        sentence: connection.model<SentenceDocument>(
            Sentence.name,
            SentenceSchema
        ),
        paragraph: connection.model<ParagraphDocument>(
            Paragraph.name,
            ParagraphSchema
        ),
        speech: connection.model<SpeechDocument>(Speech.name, SpeechSchema),
        unattributed: connection.model<UnattributedDocument>(
            Unattributed.name,
            UnattributedSchema
        ),
        report: connection.model<ReportDocument>(Report.name, ReportSchema),
    };
    return claimModels;
}

export async function resetTestClaims(): Promise<void> {
    if (!claimModels) return;
    await Promise.all(
        Object.values(claimModels).map((model) =>
            (model as Model<any>).deleteMany({})
        )
    );
}

export async function getTestPersonalityModel(): Promise<PersonalityModelType> {
    if (personalityModel) return personalityModel;

    const connection = await getTestConnection();
    ensureClaimModel(connection);

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

export async function getTestGroupModel(): Promise<Model<GroupDocument>> {
    if (groupModel) return groupModel;
    const connection = await getTestConnection();
    ensureClaimModel(connection);
    await getTestVerificationRequestModel();
    groupModel = connection.model<GroupDocument>(Group.name, GroupSchema);
    return groupModel;
}

export async function getTestVerificationRequestModel(): Promise<
    Model<VerificationRequestDocument>
> {
    if (verificationRequestModel) return verificationRequestModel;
    const connection = await getTestConnection();
    // Populate targets: source (pre-find hook), topic, personality, group.
    await getTestSourceModel();
    await getTestTopicModel();
    await getTestPersonalityModel();
    verificationRequestModel = connection.model<VerificationRequestDocument>(
        VerificationRequest.name,
        VerificationRequestSchema
    );
    await verificationRequestModel.init();
    if (!groupModel) {
        groupModel = connection.model<GroupDocument>(Group.name, GroupSchema);
    }
    return verificationRequestModel;
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

export async function resetTestGroups(): Promise<void> {
    if (!groupModel) return;
    await groupModel.deleteMany({});
}

export async function resetTestVerificationRequests(): Promise<void> {
    if (!verificationRequestModel) return;
    await verificationRequestModel.deleteMany({});
}

export async function stopTestMongo(): Promise<void> {
    await connection?.close();
    await server?.stop();
    connection = null;
    personalityModel = null;
    sourceModel = null;
    topicModel = null;
    badgeModel = null;
    groupModel = null;
    verificationRequestModel = null;
    claimModels = null;
    server = null;
}

/** A syntactically valid ObjectId that matches no document. */
export function missingMongoId(): string {
    return new Types.ObjectId().toString();
}
