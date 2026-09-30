import type { IPersonalityService } from "../interfaces/personality.service.interface";
import type { MongoPersonalityService } from "./mongo/personality.service";
import type { PostgresPersonalityService } from "./postgres/personality.service";
import type { ExactlyImplements } from "../interfaces/service-surface.type";

/**
 * Compile-time check that each implementation's PUBLIC surface matches
 * IPersonalityService exactly (enforced by yarn build-ts). See
 * server/interfaces/service-surface.type.ts for the gate semantics.
 */

// These constants must be `true` — TypeScript will complain otherwise.
export const _mongoExact: ExactlyImplements<
    MongoPersonalityService,
    IPersonalityService
> = true;
export const _pgExact: ExactlyImplements<
    PostgresPersonalityService,
    IPersonalityService
> = true;
