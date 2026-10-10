import { Inject, Injectable } from "@nestjs/common";
import type {
    ClaimContentRef,
    IClaimRevisionService,
} from "../../../interfaces/claim-revision.service.interface";
import type { IClaimRevision } from "../../../interfaces/claim-revision.interface";
import type { IFindAllOptions } from "../../../interfaces/personality.interface";
import { DRIZZLE } from "../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../database/postgres/connection";
import { NotImplementedError } from "../../../database/errors";

@Injectable()
export class PostgresClaimRevisionService implements IClaimRevisionService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    getRevision(_match: Record<string, any>): Promise<IClaimRevision | null> {
        throw new NotImplementedError("postgres", "getRevision");
    }

    getRevisionById(_id: string): Promise<IClaimRevision | null> {
        throw new NotImplementedError("postgres", "getRevisionById");
    }

    create(
        _claimId: any,
        _claim: Record<string, any>
    ): Promise<IClaimRevision> {
        throw new NotImplementedError("postgres", "create");
    }

    findAll(
        _options: IFindAllOptions
    ): Promise<{ totalRows: number; processedRevisions: any[] }> {
        throw new NotImplementedError("postgres", "findAll");
    }

    getByContentId(
        _contentId: ClaimContentRef
    ): Promise<IClaimRevision | null> {
        throw new NotImplementedError("postgres", "getByContentId");
    }
}
