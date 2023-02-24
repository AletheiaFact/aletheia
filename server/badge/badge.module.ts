import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AbilityModule } from "../ability/ability.module";
import { ViewModule } from "../view/view.module";
import { BadgeController } from "./badge.controller";
import { BadgeService } from "./badge.service";
import { Badge, BadgeSchema } from "./schemas/badge.schema";

const BadgeModel = MongooseModule.forFeature([
    {
        name: Badge.name,
        schema: BadgeSchema,
    },
]);

@Module({
    imports: [BadgeModel, ViewModule, AbilityModule],
    exports: [BadgeService],
    providers: [BadgeService],
    controllers: [BadgeController],
})
export class BadgeModule {}
