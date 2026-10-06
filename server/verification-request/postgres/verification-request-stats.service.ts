import { Injectable } from "@nestjs/common";
import type {
    IVerificationRequestStatsService,
    VerificationRequestStats,
} from "../../interfaces/verification-request.service.interface";
import { NotImplementedError } from "../../database/errors";

@Injectable()
export class PostgresVerificationRequestStatsService
    implements IVerificationRequestStatsService
{
    async getStats(): Promise<VerificationRequestStats> {
        throw new NotImplementedError("postgres", "getStats");
    }
}
