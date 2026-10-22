import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AbilityModule } from "../auth/ability/ability.module";
import { ImageModule } from "../claim/types/image/image.module";
import { FeatureFlagModule } from "../feature-flag/feature-flag.module";
import { MongoOrganizationService } from "./mongo/organization.service";
import {
    Organization,
    OrganizationSchema,
} from "./mongo/schemas/organization.schema";
import { OrganizationController } from "./organization.controller";

const OrganizationModel = MongooseModule.forFeature([
    { name: Organization.name, schema: OrganizationSchema },
]);

// Mongo only for now; a Postgres implementation plugs in behind the
// "OrganizationService" token when events are ported.
@Module({
    imports: [OrganizationModel, ImageModule, AbilityModule, FeatureFlagModule],
    controllers: [OrganizationController],
    providers: [
        {
            provide: "OrganizationService",
            useClass: MongoOrganizationService,
        },
    ],
    exports: ["OrganizationService"],
})
export class OrganizationModule {}
