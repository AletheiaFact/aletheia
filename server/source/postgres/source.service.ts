import { Injectable } from "@nestjs/common";
import type {
    ISourceService,
    SourceTargetRef,
} from "../../interfaces/source.service.interface";
import { ISource } from "../../interfaces/source.interface";
import { NotImplementedError } from "../../database/errors";

@Injectable()
export class PostgresSourceService implements ISourceService {
    async listAll(_options: {
        page: number;
        pageSize: string;
        order: string;
        nameSpace: string;
    }): Promise<ISource[]> {
        throw new NotImplementedError("postgres", "listAll");
    }

    async listAllDailySourceReviews(
        _query: Record<string, any>
    ): Promise<ISource[]> {
        throw new NotImplementedError("postgres", "listAllDailySourceReviews");
    }

    async create(_data: any): Promise<ISource> {
        throw new NotImplementedError("postgres", "create");
    }

    async updateTargetId(
        _sourceId: string,
        _newTargetId: SourceTargetRef
    ): Promise<ISource> {
        throw new NotImplementedError("postgres", "updateTargetId");
    }

    async getByTargetId(
        _targetId: string,
        _page: number,
        _pageSize: number,
        _order: string
    ): Promise<ISource[]> {
        throw new NotImplementedError("postgres", "getByTargetId");
    }

    find(_match: Record<string, any>): any {
        throw new NotImplementedError("postgres", "find");
    }

    async getSourceByHref(_href: string): Promise<ISource | null> {
        throw new NotImplementedError("postgres", "getSourceByHref");
    }

    async getById(_sourceId: string): Promise<ISource | null> {
        throw new NotImplementedError("postgres", "getById");
    }

    async getByDataHash(_dataHash: string): Promise<ISource> {
        throw new NotImplementedError("postgres", "getByDataHash");
    }

    async update(_dataHash: string, _sourceBodyUpdate: any): Promise<ISource> {
        throw new NotImplementedError("postgres", "update");
    }

    async count(_query: Record<string, any>): Promise<number> {
        throw new NotImplementedError("postgres", "count");
    }
}
