import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Claim, ClaimSchema } from "./schemas/claim.schema";
import { ClaimService } from "./claim.service";
import { ClaimController } from "./claim.controller";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ParserModule } from "./parser/parser.module";
import { PersonalityModule } from "../personality/personality.module";
import { ConfigModule } from "@nestjs/config";
import { ViewModule } from "../view/view.module";
import { ClaimRevisionModule } from "./claim-revision/claim-revision.module";
import { HistoryModule } from "../history/history.module";
import { CaptchaModule } from "../captcha/captcha.module";
import { ReviewTaskModule } from "../review-task/review-task.module";
import { SentenceModule } from "./types/sentence/sentence.module";
import { StateEventModule } from "../state-event/state-event.module";
import { ImageModule } from "./types/image/image.module";
import { DebateModule } from "./types/debate/debate.module";
import { InterviewModule } from "./types/interview/interview.module";
import { EditorModule } from "../editor/editor.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { UtilService } from "../util";
import { FeatureFlagModule } from "../feature-flag/feature-flag.module";
import { GroupModule } from "../group/group.module";

const ClaimModel = MongooseModule.forFeature([
    {
        name: Claim.name,
        schema: ClaimSchema,
    },
]);

@Module({
    imports: [
        ClaimModel,
        ClaimReviewModule,
        ReviewTaskModule,
        ClaimRevisionModule,
        SentenceModule,
        ParserModule,
        PersonalityModule,
        HistoryModule,
        StateEventModule,
        ConfigModule,
        ViewModule,
        CaptchaModule,
        ImageModule,
        DebateModule,
        InterviewModule,
        EditorModule,
        AbilityModule,
        FeatureFlagModule,
        GroupModule,
    ],
    exports: [ClaimService],
    providers: [UtilService, ClaimService],
    controllers: [ClaimController],
})
export class ClaimModule { }
