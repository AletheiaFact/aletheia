import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReportModule } from "../report/report.module";
import { Sentence, SentenceSchema } from "./schemas/sentence.schema";
import { SentenceService } from "./sentence.service";

const SentenceModel = MongooseModule.forFeature([
    {
        name: Sentence.name,
        schema: SentenceSchema,
    },
]);

@Module({
    imports: [SentenceModel, ReportModule],
    providers: [SentenceService],
    exports: [SentenceService],
})
export class SentenceModule {}
