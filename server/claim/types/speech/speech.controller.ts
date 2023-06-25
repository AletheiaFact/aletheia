import { Controller, Get, Param } from "@nestjs/common";
import { SpeechService } from "./speech.service";

@Controller()
export class SpeechController {
    constructor(private speechService: SpeechService) {}

    @Get("api/speech/:id")
    public async getSpeech(@Param("id") id: string) {
        return this.speechService.getSpeech(id);
    }
}
