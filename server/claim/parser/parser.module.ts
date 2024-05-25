import { ParserService } from "./parser.service";
import { Module } from "@nestjs/common";
import { SpeechModule } from "../types/speech/speech.module";
import { ParagraphModule } from "../types/paragraph/paragraph.module";
import { SentenceModule } from "../types/sentence/sentence.module";
import { GenerativeInformationModule } from "../types/generative-information/generative-information.module";

@Module({
    imports: [
        SpeechModule,
        ParagraphModule,
        SentenceModule,
        GenerativeInformationModule,
    ],
    exports: [ParserService],
    providers: [ParserService],
})
export class ParserModule {}
