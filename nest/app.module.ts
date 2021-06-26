import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { WikidataModule } from "./wikidata/wikidata.module";
import { PersonalityModule } from "./personality/personality.module";
import { ClaimModule } from "./claim/claim.module";
import { ClaimReviewModule } from "./claim-review/claim-review.module";
import { SourceModule } from "./source/source.module";
import { StatsController } from "./stats/stats.controller";
import { StatsModule } from "./stats/stats.module";
import { RootController } from "./root/root.controller";

const mongodb_host = process.env.MONGODB_HOST || "localhost";
const mongodb_name = process.env.MONGODB_NAME || "Aletheia";

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://${mongodb_host}/${mongodb_name}`, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }),
        UsersModule,
        AuthModule,
        WikidataModule,
        PersonalityModule,
        ClaimModule,
        ClaimReviewModule,
        SourceModule,
        StatsModule,
    ],
    controllers: [RootController],
})
export class AppModule {}
