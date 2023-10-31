import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageModule } from "../claim/types/image/image.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { ViewModule } from "../view/view.module";
import { BadgeController } from "./badge.controller";
import { BadgeService } from "./badge.service";
import { Badge, BadgeSchema } from "./schemas/badge.schema";
import { UsersModule } from "../users/users.module";
import { UtilService } from "../util";
import { ConfigModule } from "@nestjs/config";

const BadgeModel = MongooseModule.forFeature([
    {
        name: Badge.name,
        schema: BadgeSchema,
    },
]);

@Module({
    imports: [
        BadgeModel,
        ViewModule,
        AbilityModule,
        ImageModule,
        UsersModule,
        ConfigModule,
    ],
    exports: [BadgeService],
    providers: [BadgeService, UtilService],
    controllers: [BadgeController],
})
export class BadgeModule {}
