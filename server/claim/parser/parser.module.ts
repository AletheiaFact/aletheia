import { ParserService } from "./parser.service";
import { Module } from "@nestjs/common";
import { SpeechModule } from "../types/speech/speech.module";
import { ParagraphModule } from "../types/paragraph/paragraph.module";
import { SentenceModule } from "../types/sentence/sentence.module";

@Module({
    imports: [SpeechModule, ParagraphModule, SentenceModule],
    exports: [ParserService],
    providers: [ParserService],
})
export class ParserModule {}
