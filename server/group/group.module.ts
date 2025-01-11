import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Group, GroupSchema } from "./schemas/group.schema";
import { GroupService } from "./group.service";

const GroupModel = MongooseModule.forFeature([
    {
        name: Group.name,
        schema: GroupSchema,
    },
]);

@Module({
    imports: [GroupModel],
    exports: [GroupService],
    providers: [GroupService],
})
export class GroupModule {}
