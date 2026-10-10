import { Inject, Injectable } from "@nestjs/common";
import type { IUnattributedService } from "../../../../interfaces/unattributed.service.interface";
import type { IUnattributed } from "../../../../interfaces/claim-content.interface";
import { DRIZZLE } from "../../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../../database/postgres/connection";
import { NotImplementedError } from "../../../../database/errors";

@Injectable()
export class PostgresUnattributedService implements IUnattributedService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    create(_unattributedBody: Record<string, any>): Promise<IUnattributed> {
        throw new NotImplementedError("postgres", "create");
    }
}
