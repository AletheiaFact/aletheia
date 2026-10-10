import { Controller, Get, Inject } from "@nestjs/common";
import type { ISpeechService } from "../../../interfaces/speech.service.interface";
import { ApiTags } from "@nestjs/swagger";
import { ZodParam } from "../../../common/validation";
import { entityId } from "../../../../lib/schemas";

@Controller()
export class SpeechController {
    constructor(
        @Inject("SpeechService") private speechService: ISpeechService
    ) {}

    @ApiTags("claim")
    @Get("api/speech/:id")
    public async getSpeech(@ZodParam("id", entityId) id: string) {
        return this.speechService.getSpeech(id);
    }
}
