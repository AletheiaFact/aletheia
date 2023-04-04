import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HistoryModule } from "../history/history.module";
import { EditorModule } from "../editor/editor.module";
import { DebateService } from "./debate.service";
import { Debate, DebateSchema } from "./schemas/debate.schema";

const DebateModel = MongooseModule.forFeature([
    {
        name: Debate.name,
        schema: DebateSchema,
    },
]);

@Module({
    imports: [DebateModel, EditorModule, HistoryModule],
    providers: [DebateService],
    exports: [DebateService],
})
export class DebateModule {}
