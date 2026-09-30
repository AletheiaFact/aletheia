import type { ISourceService } from "../interfaces/source.service.interface";
import type { MongoSourceService } from "./mongo/source.service";
import type { PostgresSourceService } from "./postgres/source.service";
import type { ExactlyImplements } from "../interfaces/service-surface.type";

/**
 * Compile-time check that each implementation's PUBLIC surface matches
 * ISourceService exactly (enforced by yarn build-ts). See
 * server/interfaces/service-surface.type.ts for the gate semantics.
 */

// These constants must be `true` — TypeScript will complain otherwise.
export const _mongoExact: ExactlyImplements<
    MongoSourceService,
    ISourceService
> = true;
export const _pgExact: ExactlyImplements<
    PostgresSourceService,
    ISourceService
> = true;
