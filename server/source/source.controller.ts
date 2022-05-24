import { Controller, Get, Logger, Param, Query } from "@nestjs/common";
import { SourceService } from "./source.service";

@Controller()
export class SourceController {
    private readonly logger = new Logger("SourceController");
    constructor(private sourceService: SourceService) {}

    @Get("api/source/:targetId")
    public async getSourcesClaim(@Param() params, @Query() getSources: any) {
        const { targetId } = params;
        const { page, order } = getSources;
        const pageSize = parseInt(getSources.pageSize, 10)
        return this.sourceService
            .getByTargetId(targetId, page, pageSize, order)
            .then((sources) => {
                const totalSources = sources.length;
                const totalPages = Math.ceil(
                    totalSources / pageSize
                );
                this.logger.log(
                    `Found ${totalSources} sources for targetId ${targetId}. Page ${page} of ${totalPages}`
                );
                return { sources, totalSources, totalPages, page, pageSize };
            })
            .catch();
    }
}
