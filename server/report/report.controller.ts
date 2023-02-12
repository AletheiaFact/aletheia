import { Controller, Param, Get } from "@nestjs/common";
import { ReportService } from "./report.service";
@Controller()
export class ReportController {
    constructor(private reportService: ReportService) {}

    @Get("api/report/:data_hash")
    async getByDataHash(@Param("data_hash") data_hash: string) {
        return this.reportService.findByDataHash(data_hash);
    }
}
