import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Claim, ClaimSchema } from "./schemas/claim.schema";
import { ClaimService } from "./claim.service";
import { ClaimController } from "./claim.controller";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ParserModule } from "../parser/parser.module";
import { PersonalityModule } from "../personality/personality.module";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { ViewModule } from "../view/view.module";
import { SourceModule } from "../source/source.module";
import { ClaimRevisionModule } from "../claim-revision/claim-revision.module"
import { ClaimRevision, ClaimRevisionSchema } from "../claim-revision/schema/claim-revision.schema"

const ClaimModel = MongooseModule.forFeature([
    {
        name: Claim.name,
        schema: ClaimSchema,
    },
]);

const ClaimRevisionModel = MongooseModule.forFeature([
    {
        name: ClaimRevision.name,
        schema: ClaimRevisionSchema,
    },
]);

@Module({
    imports: [
        ClaimModel,
        ClaimRevisionModel,
        ClaimReviewModule,
        ClaimRevisionModule,
        ParserModule,
        PersonalityModule,
        ConfigModule,
        HttpModule,
        ViewModule,
        SourceModule,
    ],
    exports: [ClaimService],
    providers: [ClaimService],
    controllers: [ClaimController],
})
export class ClaimModule {}
