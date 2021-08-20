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
        ParserModule,
        PersonalityModule,
        ConfigModule,
        HttpModule,
    ],
    exports: [ClaimService],
    providers: [ClaimService],
    controllers: [ClaimController],
})
export class ClaimModule {}
