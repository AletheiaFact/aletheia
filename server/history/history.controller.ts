import { Controller, Get, Logger, Param, Query } from "@nestjs/common";
import { HistoryService } from "./history.service";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class HistoryController {
    private readonly logger = new Logger("HistoryController");
    constructor(private historyService: HistoryService) {}

    @ApiTags("history")
    @Get("api/history/:targetModel/:targetId")
    public async getHistory(@Param() param, @Query() getHistory: any) {
        const { targetId, targetModel } = param;
        const { page, order } = getHistory;
        const pageSize = parseInt(getHistory.pageSize, 10);
        return this.historyService
            .getByTargetIdModelAndType({
                targetId: targetId,
                targetModel: targetModel,
                page: page,
                pageSize: pageSize,
                order: order
            })
            .then((history) => {
                const totalChanges = history.length;
                const totalPages = Math.ceil(totalChanges / pageSize);
                this.logger.log(
                    `Found ${totalChanges} changes for targetId ${targetId}. Page ${page} of ${totalPages}`
                );
                return { history, totalChanges, totalPages, page, pageSize };
            })
            .catch();
    }
}
