import { Controller, Post, UseGuards } from "@nestjs/common";
import { SummarizationService } from "./summarization.service";
import {
    AdminUserAbility,
    CheckAbilities,
} from "../auth/ability/ability.decorator";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";

@Controller()
export class SummarizationController {
    constructor(private summarizationService: SummarizationService) {}

    @Post("api/daily-report")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    //TODO: ADD nameSpace logic
    async createDailyReport() {
        const nameSpace = "Main";
        const dailyReport = await this.summarizationService.generateDailyReport(
            nameSpace
        );

        return dailyReport;
    }
}
