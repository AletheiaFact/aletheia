import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { ViewModule } from "../view/view.module";
import OryModule from "../auth/ory/ory.module";
import { ConfigModule } from "@nestjs/config";
import { AbilityModule } from "../auth/ability/ability.module";
import { UtilService } from "../util";
import { NotificationModule } from "../notifications/notifications.module";
import { SessionGuard } from "../auth/session.guard";
import { M2MGuard } from "../auth/m2m.guard";

const UserModel = MongooseModule.forFeature([
    {
        name: User.name,
        schema: UserSchema,
    },
]);

@Module({
    imports: [
        UserModel,
        ViewModule,
        OryModule,
        ConfigModule,
        AbilityModule,
        NotificationModule
    ],
    exports: [UsersService, UserModel],
    controllers: [UsersController],
    providers: [UsersService, UtilService, SessionGuard, M2MGuard],
})
export class UsersModule {}
