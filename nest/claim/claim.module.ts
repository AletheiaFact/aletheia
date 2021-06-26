import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Claim, ClaimSchema } from "./schemas/claim.schema";

const ClaimModel = MongooseModule.forFeatureAsync([
    {
        name: Claim.name,
        useFactory: () => ClaimSchema,
    },
]);

@Module({
    imports: [ClaimModel],
})
export class ClaimModule {}
