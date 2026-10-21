/**
 * Compile-time gate types for the per-module `<module>.service.type-test.ts`
 * files: each backend implementation's PUBLIC surface must match its resource
 * interface exactly (docs/postgres-migration-foundation.md §3). The gate
 * compares method NAMES (key sets), not signatures — signature drift is
 * caught behaviorally by the dual-backend contract suites.
 */

export type PublicSurface<T> = Omit<
    { [K in keyof T]: T[K] },
    | "onModuleInit"
    | "onModuleDestroy"
    | "onApplicationBootstrap"
    | "onApplicationShutdown"
    | "beforeApplicationShutdown"
>;

export type ExactlyImplements<C, I> = [
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
