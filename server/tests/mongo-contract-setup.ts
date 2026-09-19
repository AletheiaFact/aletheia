import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection, Model, Types } from "mongoose";
import type { ISoftDeletedModel } from "mongoose-softdelete-typescript";
import {
    Personality,
    PersonalityDocument,
    PersonalitySchema,
} from "../personality/mongo/schemas/personality.schema";

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

export async function getTestPersonalityModel(): Promise<PersonalityModelType> {
    if (personalityModel) return personalityModel;

    server = await MongoMemoryServer.create();
    connection = await mongoose
        .createConnection(server.getUri("contract-tests"))
        .asPromise();

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

/** Remove every personality between tests (soft-deleted rows included). */
export async function resetTestPersonalities(): Promise<void> {
    if (!personalityModel) return;
    await personalityModel.deleteMany({});
}

export async function stopTestMongo(): Promise<void> {
    await connection?.close();
    await server?.stop();
    connection = null;
    personalityModel = null;
    server = null;
}

/** A syntactically valid ObjectId that matches no document. */
export function missingMongoId(): string {
    return new Types.ObjectId().toString();
}
