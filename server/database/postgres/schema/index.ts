// Re-exports module Drizzle schemas for the global Drizzle client.
// Add new modules here as they are ported (one re-export line per module).

export * from "../../../personality/postgres/schema/personality.schema";
export * from "../../../source/postgres/schema/source.schema";
export * from "../../../topic/postgres/schema/topic.schema";
export * from "../../../badge/postgres/schema/badge.schema";
export * from "../../../group/postgres/schema/group.schema";
export * from "../../../verification-request/postgres/schema/verification-request.schema";
export * from "../../../claim/postgres/schema/claim.schema";
export * from "../../../claim/claim-revision/postgres/schema/claim-revision.schema";
export * from "../../../claim/types/sentence/postgres/schema/sentence.schema";
export * from "../../../claim/types/paragraph/postgres/schema/paragraph.schema";
export * from "../../../claim/types/speech/postgres/schema/speech.schema";
export * from "../../../claim/types/unattributed/postgres/schema/unattributed.schema";
export * from "../../../report/postgres/schema/report.schema";
