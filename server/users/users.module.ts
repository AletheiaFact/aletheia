import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { ViewModule } from "../view/view.module";

const UserModel = MongooseModule.forFeatureAsync([
    {
        name: User.name,
        useFactory: () => {
            const schema = UserSchema;
            schema.plugin(require("passport-local-mongoose"), {
                usernameField: "email",
            });
            return schema;
        },
    },
]);

@Module({
    imports: [UserModel, ViewModule],
    exports: [UsersService, UserModel],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
