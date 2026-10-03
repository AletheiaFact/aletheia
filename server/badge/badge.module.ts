import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageModule } from "../claim/types/image/image.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { ViewModule } from "../view/view.module";
import { BadgeController } from "./badge.controller";
import { MongoBadgeService } from "./mongo/badge.service";
import { PostgresBadgeService } from "./postgres/badge.service";
import { badgeServiceProvider } from "./badge.provider";
import { Badge, BadgeSchema } from "./mongo/schemas/badge.schema";
import { UsersModule } from "../users/users.module";
import { UtilService } from "../util";
import { ConfigModule } from "@nestjs/config";
import { CaptchaModule } from "../captcha/captcha.module";
import dbConfig from "../config/db.config";

const BadgeModel = MongooseModule.forFeature([
    {
        name: Badge.name,
        schema: BadgeSchema,
    },
]);

@Module({})
export class BadgeModule {
    static register(): DynamicModule {
        const imports: any[] = [];
        const providers: any[] = [badgeServiceProvider, UtilService];

        if (dbConfig.type === "mongodb") {
            imports.push(BadgeModel);
            providers.push(MongoBadgeService);
        } else if (dbConfig.type === "postgres") {
            providers.push(PostgresBadgeService);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }

        return {
            module: BadgeModule,
            imports: [
                ...imports,
                ViewModule,
                AbilityModule,
                ImageModule,
                UsersModule,
                ConfigModule,
                CaptchaModule,
            ],
            controllers: [BadgeController],
            providers,
            exports: ["BadgeService"],
        };
    }
}
