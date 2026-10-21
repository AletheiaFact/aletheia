import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Claim, ClaimSchema } from "./mongo/schemas/claim.schema";
import { MongoClaimService } from "./mongo/claim.service";
import { PostgresClaimService } from "./postgres/claim.service";
import { claimServiceProvider } from "./claim.provider";
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
import { EditorModule } from "../editor/editor.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { UtilService } from "../util";
import { FeatureFlagModule } from "../feature-flag/feature-flag.module";
import { GroupModule } from "../group/group.module";
import { AdminEditorModule } from "./admin-editor/admin-editor.module";
import dbConfig from "../config/db.config";

const ClaimModel = MongooseModule.forFeature([
    {
        name: Claim.name,
        schema: ClaimSchema,
    },
]);

@Module({})
export class ClaimModule {
    static register(): DynamicModule {
        const imports: any[] = [];
        const providers: any[] = [claimServiceProvider, UtilService];

        if (dbConfig.type === "mongodb") {
            imports.push(ClaimModel);
            providers.push(MongoClaimService);
        } else if (dbConfig.type === "postgres") {
            providers.push(PostgresClaimService);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }

        return {
            module: ClaimModule,
            imports: [
                ...imports,
                ClaimReviewModule,
                ReviewTaskModule,
                ClaimRevisionModule.register(),
                SentenceModule,
                ParserModule,
                PersonalityModule.register(),
                HistoryModule,
                StateEventModule,
                ConfigModule,
                ViewModule,
                CaptchaModule,
                ImageModule,
                DebateModule,
                EditorModule,
                AbilityModule,
                FeatureFlagModule,
                GroupModule.register(),
                AdminEditorModule,
            ],
            exports: ["ClaimService"],
            providers,
            controllers: [ClaimController],
        };
    }
}
