import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NameSpace, NameSpaceSchema } from "./schemas/name-space.schema";
import { NameSpaceController } from "./name-space.controller";
import { NameSpaceService } from "./name-space.service";

const NameSpaceModel = MongooseModule.forFeature([
    {
        name: NameSpace.name,
        schema: NameSpaceSchema,
    },
]);

@Module({
    imports: [NameSpaceModel],
    providers: [NameSpaceService],
    exports: [NameSpaceService],
    controllers: [NameSpaceController],
})
export class NameSpaceModule {}
