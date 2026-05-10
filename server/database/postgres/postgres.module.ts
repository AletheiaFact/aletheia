import {
    DynamicModule,
    Module,
    OnModuleDestroy,
    Inject,
    Global,
} from "@nestjs/common";
import type { Pool } from "pg";
import { createPool, createDrizzle } from "./connection";
import { DRIZZLE } from "./postgres.provider";

export interface PostgresModuleOptions {
    connection_uri: string;
    pool_size: number;
    fuzzy_threshold?: number;
}

const POOL = Symbol("POOL");

@Global()
@Module({})
export class PostgresModule implements OnModuleDestroy {
    constructor(@Inject(POOL) private readonly pool: Pool) {}

    static forRoot(options: PostgresModuleOptions): DynamicModule {
        const poolProvider = {
            provide: POOL,
            useFactory: () =>
                createPool(options.connection_uri, options.pool_size),
        };
        const drizzleProvider = {
            provide: DRIZZLE,
            useFactory: (pool: Pool) => createDrizzle(pool),
            inject: [POOL],
        };
        return {
            module: PostgresModule,
            providers: [poolProvider, drizzleProvider],
            exports: [DRIZZLE],
        };
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}
