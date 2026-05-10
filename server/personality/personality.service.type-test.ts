import type { IPersonalityService } from "../interfaces/personality.service.interface";
import type { MongoPersonalityService } from "./mongo/personality.service";
import type { PostgresPersonalityService } from "./postgres/personality.service";

/**
 * Compile-time check that each implementation's PUBLIC surface matches the
 * resource interface exactly. If a developer adds a public method to either
 * implementation without first adding it to IPersonalityService, this file
 * fails to compile (yarn build-ts), and the error message names the offending
 * method.
 *
 * This is the per-resource-interface enforcement gate documented in
 * docs/superpowers/specs/2026-05-10-postgres-foundational-layer-design.md §3.5.
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
const _mongoExact: ExactlyImplements<
    MongoPersonalityService,
    IPersonalityService
> = true;
const _pgExact: ExactlyImplements<
    PostgresPersonalityService,
    IPersonalityService
> = true;

// Suppress unused-variable lint complaints — the assertions ARE the test.
void _mongoExact;
void _pgExact;
