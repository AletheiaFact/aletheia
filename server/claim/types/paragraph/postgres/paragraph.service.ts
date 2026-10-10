import { Inject, Injectable } from "@nestjs/common";
import type { IParagraphService } from "../../../../interfaces/paragraph.service.interface";
import { DRIZZLE } from "../../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../../database/postgres/connection";
import { NotImplementedError } from "../../../../database/errors";

@Injectable()
export class PostgresParagraphService implements IParagraphService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    create(_paragraphBody: Record<string, any>): Promise<any> {
        throw new NotImplementedError("postgres", "create");
    }
}
