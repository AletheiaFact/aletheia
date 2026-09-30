import { DynamicModule, Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Source, SourceSchema } from "./mongo/schemas/source.schema";
import { SourceController } from "./source.controller";
import { MongoSourceService } from "./mongo/source.service";
import { PostgresSourceService } from "./postgres/source.service";
import { sourceServiceProvider } from "./source.provider";
import { ViewModule } from "../view/view.module";
import { ConfigModule } from "@nestjs/config";
import { CaptchaModule } from "../captcha/captcha.module";
import { HistoryModule } from "../history/history.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ReviewTaskModule } from "../review-task/review-task.module";
import { FeatureFlagModule } from "../feature-flag/feature-flag.module";
import dbConfig from "../config/db.config";

const SourceModel = MongooseModule.forFeature([
    {
        name: Source.name,
        schema: SourceSchema,
    },
]);

@Module({})
export class SourceModule {
    static register(): DynamicModule {
        const imports: any[] = [];
        const providers: any[] = [sourceServiceProvider];

        if (dbConfig.type === "mongodb") {
            imports.push(SourceModel);
            providers.push(MongoSourceService);
        } else if (dbConfig.type === "postgres") {
            providers.push(PostgresSourceService);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }

        return {
            module: SourceModule,
            imports: [
                ...imports,
                ViewModule,
                ConfigModule,
                CaptchaModule,
                HistoryModule,
                forwardRef(() => ClaimReviewModule),
                ReviewTaskModule,
                FeatureFlagModule,
            ],
            providers,
            exports: ["SourceService"],
            controllers: [SourceController],
        };
    }
}
