import { Body, Controller, Post, Header } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AutomatedFactCheckingService } from "./automated-fact-checking.service";
import { CreateAutomatedFactCheckingDTO } from "./dto/create-automated-fact-checking.dto";

@Controller()
export class AutomatedFactCheckingController {
    constructor(
        private automatedFactCheckingService: AutomatedFactCheckingService
    ) {}

    @ApiTags("automated-fact-checking")
    @Post("api/ai-fact-checking")
    @Header("Cache-Control", "no-cache")
    async create(@Body() { sentence }: CreateAutomatedFactCheckingDTO) {
        return this.automatedFactCheckingService.getResponseFromAgents(
            sentence
        );
    }
}
