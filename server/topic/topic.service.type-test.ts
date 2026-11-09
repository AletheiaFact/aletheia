import type { ITopicService } from "../interfaces/topic.service.interface";
import type { MongoTopicService } from "./mongo/topic.service";
import type { PostgresTopicService } from "./postgres/topic.service";
import type { ExactlyImplements } from "../interfaces/service-surface.type";

/**
 * Compile-time check that each implementation's PUBLIC surface matches
 * ITopicService exactly (enforced by yarn build-ts). See
 * server/interfaces/service-surface.type.ts for the gate semantics.
 */

// These constants must be `true` — TypeScript will complain otherwise.
export const _mongoExact: ExactlyImplements<MongoTopicService, ITopicService> =
    true;
export const _pgExact: ExactlyImplements<PostgresTopicService, ITopicService> =
    true;
