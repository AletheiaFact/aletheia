import { ParserService } from "./parser.service";
import { Module } from "@nestjs/common";
import { SpeechModule } from "../speech/speech.module";
import { ParagraphModule } from "../paragraph/paragraph.module";

@Module({
    imports: [
        SpeechModule,
        ParagraphModule,
    ],
    exports: [ParserService],
    providers: [ParserService],
})
export class ParserModule {}
