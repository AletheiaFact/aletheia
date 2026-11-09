import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HistoryModule } from "../../../history/history.module";
import { EditorModule } from "../../../editor/editor.module";
import { DebateService } from "./debate.service";
import { Debate, DebateSchema } from "./schemas/debate.schema";
import { Speech, SpeechSchema } from "../speech/mongo/schemas/speech.schema";
import {
    Paragraph,
    ParagraphSchema,
} from "../paragraph/mongo/schemas/paragraph.schema";
import {
    Sentence,
    SentenceSchema,
} from "../sentence/mongo/schemas/sentence.schema";

// Speech, Paragraph and Sentence are registered here so the debate can
// read draft transcript speeches and publish them on approval.
const DebateModel = MongooseModule.forFeature([
    {
        name: Debate.name,
        schema: DebateSchema,
    },
    { name: Speech.name, schema: SpeechSchema },
    { name: Paragraph.name, schema: ParagraphSchema },
    { name: Sentence.name, schema: SentenceSchema },
]);

@Module({
    imports: [DebateModel, EditorModule, HistoryModule],
    providers: [DebateService],
    exports: [DebateService],
})
export class DebateModule {}
