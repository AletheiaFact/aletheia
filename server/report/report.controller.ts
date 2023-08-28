import { Controller, Param, Get } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ApiTags } from "@nestjs/swagger";
@Controller()
export class ReportController {
    constructor(private reportService: ReportService) {}

    @ApiTags("report")
    @Get("api/report/:data_hash")
    async getByDataHash(@Param("data_hash") data_hash: string) {
        return this.reportService.findByDataHash(data_hash);
    }
}
