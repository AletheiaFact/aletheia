import { ParserService } from "./parser.service";
import { Module } from "@nestjs/common";
import { SpeechModule } from "../speech/speech.module";

@Module({
    imports: [SpeechModule],
    exports: [ParserService],
    providers: [ParserService],
})
export class ParserModule {}
