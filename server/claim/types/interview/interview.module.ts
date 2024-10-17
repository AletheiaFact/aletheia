import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HistoryModule } from "../../../history/history.module";
import { EditorModule } from "../../../editor/editor.module";
import { InterviewService } from "./interview.service";
import { Interview, InterviewSchema } from "./schemas/interview.schema";

const InterviewModel = MongooseModule.forFeature([
    {
        name: Interview.name,
        schema: InterviewSchema,
    },
]);

@Module({
    imports: [InterviewModel, EditorModule, HistoryModule],
    providers: [InterviewService],
    exports: [InterviewService],
})
export class InterviewModule { }
