import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NameSpace, NameSpaceSchema } from "./schemas/name-space.schema";
import { NameSpaceController } from "./name-space.controller";
import { NameSpaceService } from "./name-space.service";
import { UsersModule } from "../../users/users.module";
import { ViewModule } from "../../view/view.module";
import { AbilityModule } from "../../auth/ability/ability.module";
import { ConfigModule } from "@nestjs/config";
import { NotificationModule } from "../../notifications/notifications.module";

const NameSpaceModel = MongooseModule.forFeature([
    {
        name: NameSpace.name,
        schema: NameSpaceSchema,
    },
]);

@Module({
    imports: [
        NameSpaceModel,
        forwardRef(() => UsersModule),
        ViewModule,
        AbilityModule,
        ConfigModule,
        NotificationModule,
    ],
    providers: [NameSpaceService],
    exports: [NameSpaceService],
    controllers: [NameSpaceController],
})
export class NameSpaceModule {}
