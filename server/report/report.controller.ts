import { Controller, Param, Get } from "@nestjs/common";
import { ReportService } from "./report.service";
@Controller()
export class ReportController {
    constructor(
        private reportService: ReportService,
    ) {}
    
    @Get("api/report/:sentence_hash")
    async getBySentenceHash(@Param("sentence_hash") sentence_hash: string) {
        return this.reportService.findBySentenceHash(sentence_hash)
    }
}
