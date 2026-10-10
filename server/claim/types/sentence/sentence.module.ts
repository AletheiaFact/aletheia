import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Sentence, SentenceSchema } from "./mongo/schemas/sentence.schema";
import { MongoSentenceService } from "./mongo/sentence.service";
import { PostgresSentenceService } from "./postgres/sentence.service";
import { sentenceServiceProvider } from "./sentence.provider";
import { ReportModule } from "../../../report/report.module";
import { SentenceController } from "./sentence.controller";
import { UtilService } from "../../../util";
import dbConfig from "../../../config/db.config";

const SentenceModel = MongooseModule.forFeature([
    {
        name: Sentence.name,
        schema: SentenceSchema,
    },
]);

// Static on purpose: claim-review and review-task forwardRef this module, and
// Nest 9 cannot forwardRef a dynamic module from another dynamic module.
@Module({
    imports: [
        ...(dbConfig.type === "mongodb" ? [SentenceModel] : []),
        ReportModule,
    ],
    controllers: [SentenceController],
    providers: [
        sentenceServiceProvider,
        UtilService,
        dbConfig.type === "postgres"
            ? PostgresSentenceService
            : MongoSentenceService,
    ],
    exports: ["SentenceService"],
})
export class SentenceModule {}
