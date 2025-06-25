import { Module, forwardRef } from "@nestjs/common";
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
import { NameSpaceModule } from "../auth/name-space/name-space.module";
import { NameSpace, NameSpaceSchema } from "../auth/name-space/schemas/name-space.schema";


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
        forwardRef(() => NameSpaceModule),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: NameSpace.name, schema: NameSpaceSchema },
        ]),
        ConfigModule,
        AbilityModule,
        NotificationModule,
    ],
    exports: [UsersService, UserModel],
    controllers: [UsersController],
    providers: [UsersService, UtilService],
})
export class UsersModule { }
