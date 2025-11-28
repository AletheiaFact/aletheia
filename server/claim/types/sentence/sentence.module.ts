import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReportModule } from "../../../report/report.module";
import { ClaimReviewModule } from "../../../claim-review/claim-review.module";
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
    imports: [SentenceModel, ReportModule, forwardRef(() => ClaimReviewModule)],
    controllers: [SentenceController],
    providers: [UtilService, SentenceService],
    exports: [SentenceService],
})
export class SentenceModule {}
