import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { ClientSession, Connection } from "mongoose";

// Wraps Mongoose multi-document transactions.
// Requires MongoDB to run as a replica set (single-node acceptable in dev).
@Injectable()
export class TransactionHelper {
    private readonly logger = new Logger(TransactionHelper.name);

    constructor(@InjectConnection() private readonly connection: Connection) {}

    async runInTransaction<T>(
        fn: (session: ClientSession) => Promise<T>
    ): Promise<T> {
        const session = await this.connection.startSession();
        try {
            let result!: T;
            await session.withTransaction(async () => {
                result = await fn(session);
            });
            return result;
        } catch (err: any) {
            this.logger.error(
                `Transaction failed [${err?.name ?? "Error"}:${
                    err?.code ?? "n/a"
                }]: ${err?.message ?? "unknown"}`,
                err?.stack
            );
            throw err;
        } finally {
            await session.endSession();
        }
    }
}
