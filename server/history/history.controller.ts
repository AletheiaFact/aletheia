import { Controller, Get, Logger, Param, Query } from "@nestjs/common";
import { HistoryService } from "./history.service";
import { ApiTags } from "@nestjs/swagger";
import type {
    HistoryParams,
    HistoryQuery,
    HistoryResponse,
} from "./types/history.interfaces";

@ApiTags("history")
@Controller("api/history")
export class HistoryController {
    private readonly logger = new Logger(HistoryController.name);
    constructor(private historyService: HistoryService) { }

    @Get(":targetModel/:targetId")
    public async getHistory(
        @Param() param: HistoryParams,
        @Query() query: HistoryQuery
    ): Promise<HistoryResponse> {
        const { targetId, targetModel } = param;

        if (!targetId || !targetModel) {
            throw new Error("targetId and targetModel are required");
        }

        try {
            const response = await this.historyService.getHistoryForTarget(
                targetId,
                targetModel,
                query
            );
            this.logger.log(
                `Found ${response.totalChanges} changes for targetId ${targetId}. Page ${response.page} of ${response.totalPages}`
            );

            return response;
        } catch (err) {
            this.logger.error(`Error fetching history: ${err.message}`);
            throw err;
        }
    }
}
