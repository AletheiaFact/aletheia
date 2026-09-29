import type { ISourceService } from "../interfaces/source.service.interface";
import type { MongoSourceService } from "./mongo/source.service";
import type { PostgresSourceService } from "./postgres/source.service";

/**
 * Compile-time check that each implementation's PUBLIC surface matches the
 * resource interface exactly. If a developer adds a public method to either
 * implementation without first adding it to ISourceService, this file fails
 * to compile (yarn build-ts), and the error message names the offending
 * method.
 *
 * This is the per-resource-interface enforcement gate documented in
 * docs/postgres-migration-foundation.md §3. Note the gate compares method
 * NAMES (key sets), not signatures — signature drift is caught behaviorally
 * by the contract suite.
 */

type PublicSurface<T> = Omit<
    { [K in keyof T]: T[K] },
    | "onModuleInit"
    | "onModuleDestroy"
    | "onApplicationBootstrap"
    | "onApplicationShutdown"
    | "beforeApplicationShutdown"
>;

type ExactlyImplements<C, I> = [
    Exclude<keyof PublicSurface<C>, keyof I>
] extends [never]
    ? [Exclude<keyof I, keyof PublicSurface<C>>] extends [never]
        ? true
        : {
              __error: "interface has methods not on impl";
              missing: Exclude<keyof I, keyof PublicSurface<C>>;
          }
    : {
          __error: "impl exposes public methods not in interface";
          extra: Exclude<keyof PublicSurface<C>, keyof I>;
      };

// These constants must be `true` — TypeScript will complain otherwise.
export const _mongoExact: ExactlyImplements<
    MongoSourceService,
    ISourceService
> = true;
export const _pgExact: ExactlyImplements<
    PostgresSourceService,
    ISourceService
> = true;
