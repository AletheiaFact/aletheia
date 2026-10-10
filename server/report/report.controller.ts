import { Controller, Param, Get, Inject } from "@nestjs/common";
import type { IReportService } from "../interfaces/report.service.interface";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class ReportController {
    constructor(
        @Inject("ReportService") private reportService: IReportService
    ) {}

    @ApiTags("report")
    @Get("api/report/:data_hash")
    async getByDataHash(@Param("data_hash") data_hash: string) {
        return this.reportService.findByDataHash(data_hash);
    }
}
