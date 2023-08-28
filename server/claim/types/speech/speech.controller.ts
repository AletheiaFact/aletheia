import { Controller, Get, Param } from "@nestjs/common";
import { SpeechService } from "./speech.service";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class SpeechController {
    constructor(private speechService: SpeechService) {}

    @ApiTags("claim")
    @Get("api/speech/:id")
    public async getSpeech(@Param("id") id: string) {
        return this.speechService.getSpeech(id);
    }
}
