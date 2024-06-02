import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReportModule } from "../../../report/report.module";
import { Sentence, SentenceSchema } from "./schemas/sentence.schema";
import { SentenceController } from "./sentence.controller";
import { SentenceService } from "./sentence.service";
import { UtilService } from "../../../util";

const SentenceModel = MongooseModule.forFeature([
    {
        name: Sentence.name,
        schema: SentenceSchema,
    },
]);

@Module({
    imports: [SentenceModel, ReportModule],
    controllers: [SentenceController],
    providers: [UtilService, SentenceService],
    exports: [SentenceService],
})
export class SentenceModule {}
