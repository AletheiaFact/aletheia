import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageModule } from "../image/image.module";
import { AbilityModule } from "../ability/ability.module";
import { ViewModule } from "../view/view.module";
import { BadgeController } from "./badge.controller";
import { BadgeService } from "./badge.service";
import { Badge, BadgeSchema } from "./schemas/badge.schema";
import { UsersModule } from "../users/users.module";

const BadgeModel = MongooseModule.forFeature([
    {
        name: Badge.name,
        schema: BadgeSchema,
    },
]);

@Module({
    imports: [BadgeModel, ViewModule, AbilityModule, ImageModule, UsersModule],
    exports: [BadgeService],
    providers: [BadgeService],
    controllers: [BadgeController],
})
export class BadgeModule {}
