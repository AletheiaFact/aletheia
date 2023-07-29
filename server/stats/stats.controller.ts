import { Controller, Get } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { ApiTags } from "@nestjs/swagger";

@Controller("api/stats")
export class StatsController {
    constructor(private statsService: StatsService) {}

    @ApiTags("stats")
    @Get("home")
    getHomeStats() {
        return this.statsService.getHomeStats();
    }
}
