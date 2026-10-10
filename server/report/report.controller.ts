import { Controller, Get, Inject } from "@nestjs/common";
import type { IReportService } from "../interfaces/report.service.interface";
import { ApiTags } from "@nestjs/swagger";
import { ZodParam } from "../common/validation";
import { dataHash } from "../../lib/schemas";

@Controller()
export class ReportController {
    constructor(
        @Inject("ReportService") private reportService: IReportService
    ) {}

    @ApiTags("report")
    @Get("api/report/:data_hash")
    async getByDataHash(@ZodParam("data_hash", dataHash) data_hash: string) {
        return this.reportService.findByDataHash(data_hash);
    }
}
