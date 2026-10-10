import { Controller, Get, Inject, Param } from "@nestjs/common";
import type { ISpeechService } from "../../../interfaces/speech.service.interface";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class SpeechController {
    constructor(
        @Inject("SpeechService") private speechService: ISpeechService
    ) {}

    @ApiTags("claim")
    @Get("api/speech/:id")
    public async getSpeech(@Param("id") id: string) {
        return this.speechService.getSpeech(id);
    }
}
