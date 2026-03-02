import { Module } from "@nestjs/common";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ClaimModule } from "../claim/claim.module";
import { PersonalityModule } from "../personality/personality.module";
import { ManagementService } from "./management.service";
import { ManagementController } from "./management.controller";
import { AbilityModule } from "../auth/ability/ability.module";

@Module({
    imports: [
        ClaimModule,
        ClaimReviewModule,
        AbilityModule,
        PersonalityModule.register()
    ],
    controllers: [ManagementController],
    providers: [ManagementService],
})
export class ManagementModule {}
