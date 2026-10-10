import { Inject, Injectable } from "@nestjs/common";
import type {
    ClaimListQuery,
    IClaimService,
} from "../../interfaces/claim.service.interface";
import type { IClaim } from "../../interfaces/claim.interface";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { NotImplementedError } from "../../database/errors";

@Injectable()
export class PostgresClaimService implements IClaimService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    listAll(
        _page: number,
        _pageSize: number,
        _order: string,
        _query: ClaimListQuery
    ): Promise<{ data: any[]; total: number }> {
        throw new NotImplementedError("postgres", "listAll");
    }

    count(_query?: ClaimListQuery): Promise<number> {
        throw new NotImplementedError("postgres", "count");
    }

    create(_claim: Record<string, any>): Promise<any> {
        throw new NotImplementedError("postgres", "create");
    }

    update(
        _claimId: string,
        _claimRevisionUpdate: Record<string, any>
    ): Promise<any> {
        throw new NotImplementedError("postgres", "update");
    }

    delete(_claimId: string): Promise<any> {
        throw new NotImplementedError("postgres", "delete");
    }

    hideOrUnhideClaim(
        _claimId: string,
        _isHidden: boolean,
        _description?: string
    ): Promise<any> {
        throw new NotImplementedError("postgres", "hideOrUnhideClaim");
    }

    getById(_claimId: string, _nameSpace?: string): Promise<any> {
        throw new NotImplementedError("postgres", "getById");
    }

    getByClaimSlug(
        _claimSlug: string,
        _revisionId?: string,
        _population?: boolean
    ): Promise<any> {
        throw new NotImplementedError("postgres", "getByClaimSlug");
    }

    getByPersonalityId(
        _personalityId: string,
        _nameSpace?: string
    ): Promise<Array<Pick<IClaim, "_id">>> {
        throw new NotImplementedError("postgres", "getByPersonalityId");
    }

    getByPersonalityIdAndClaimSlug(
        _personalityId: string,
        _claimSlug: string,
        _revisionId?: string,
        _population?: boolean
    ): Promise<any> {
        throw new NotImplementedError(
            "postgres",
            "getByPersonalityIdAndClaimSlug"
        );
    }
}
