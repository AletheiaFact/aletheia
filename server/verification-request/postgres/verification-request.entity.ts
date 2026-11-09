import type { IVerificationRequest } from "../../interfaces/verification-request.interface";
import type { VerificationRequestRow } from "./schema/verification-request.schema";

export type PopulateField =
    | "source"
    | "impactArea"
    | "topics"
    | "identifiedData"
    | "group";

export type Populated = Partial<Record<PopulateField, any>>;

/**
 * Row → entity, the only path a verification_request row takes out of the
 * Postgres layer. Reference columns surface as ids unless `populated` carries
 * the resolved documents; the embedding is dropped unless asked for.
 */
export function toVerificationRequestEntity(
    row: VerificationRequestRow,
    populated: Populated = {},
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
        group: "group" in populated ? populated.group : groupId ?? undefined,
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
