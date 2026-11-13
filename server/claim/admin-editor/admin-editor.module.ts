import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AbilityModule } from "../../auth/ability/ability.module";
import { HistoryModule } from "../../history/history.module";
import { ReviewTaskModule } from "../../review-task/review-task.module";
import { ClaimReviewModule } from "../../claim-review/claim-review.module";
import { VerificationRequestModule } from "../../verification-request/verification-request.module";
import { CommentModule } from "../../review-task/comment/comment.module";
import { Claim, ClaimSchema } from "../mongo/schemas/claim.schema";
import {
    ClaimRevision,
    ClaimRevisionSchema,
} from "../claim-revision/mongo/schemas/claim-revision.schema";
import {
    Sentence,
    SentenceSchema,
} from "../types/sentence/mongo/schemas/sentence.schema";
import {
    Paragraph,
    ParagraphSchema,
} from "../types/paragraph/mongo/schemas/paragraph.schema";
import {
    Speech,
    SpeechSchema,
} from "../types/speech/mongo/schemas/speech.schema";
import {
    Debate,
    DebateSchema,
} from "../types/debate/schemas/debate.schema";
import {
    ClaimReview,
    ClaimReviewSchema,
} from "../../claim-review/schemas/claim-review.schema";
import {
    Report,
    ReportSchema,
} from "../../report/mongo/schemas/report.schema";
import {
    ReviewTask,
    ReviewTaskSchema,
} from "../../review-task/schemas/review-task.schema";
import { ViewModule } from "../../view/view.module";
import { AdminEditorController } from "./admin-editor.controller";
import { AdminEditorPageController } from "./admin-editor-page.controller";
import { AdminEditorService } from "./admin-editor.service";
import { CascadeService } from "./cascade.service";
import { DiffValidatorService } from "./diff-validator.service";
import { SentenceHashService } from "./sentence-hash.service";
import { TransactionHelper } from "./transaction.helper";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Claim.name, schema: ClaimSchema },
            { name: ClaimRevision.name, schema: ClaimRevisionSchema },
            { name: Sentence.name, schema: SentenceSchema },
            { name: Paragraph.name, schema: ParagraphSchema },
            { name: Speech.name, schema: SpeechSchema },
            { name: Debate.name, schema: DebateSchema },
            { name: ClaimReview.name, schema: ClaimReviewSchema },
            { name: Report.name, schema: ReportSchema },
            { name: ReviewTask.name, schema: ReviewTaskSchema },
        ]),
        AbilityModule,
        HistoryModule,
        ViewModule,
        ReviewTaskModule,
        ClaimReviewModule,
        VerificationRequestModule.register(),
        CommentModule,
    ],
    controllers: [AdminEditorController, AdminEditorPageController],
    providers: [
        AdminEditorService,
        CascadeService,
        DiffValidatorService,
        SentenceHashService,
        TransactionHelper,
    ],
    exports: [SentenceHashService, TransactionHelper],
})
export class AdminEditorModule {}
