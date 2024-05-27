import { ParserService } from "./parser.service";
import { Module } from "@nestjs/common";
import { SpeechModule } from "../types/speech/speech.module";
import { ParagraphModule } from "../types/paragraph/paragraph.module";
import { SentenceModule } from "../types/sentence/sentence.module";
import { UnattributedModule } from "../types/unattributed/unattributed.module";

@Module({
    imports: [
        SpeechModule,
        ParagraphModule,
        SentenceModule,
        UnattributedModule,
    ],
    exports: [ParserService],
    providers: [ParserService],
})
export class ParserModule {}
