import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Group, GroupSchema } from "./mongo/schemas/group.schema";
import { MongoGroupService } from "./mongo/group.service";
import { PostgresGroupService } from "./postgres/group.service";
import { groupServiceProvider } from "./group.provider";
import dbConfig from "../config/db.config";

const GroupModel = MongooseModule.forFeature([
    {
        name: Group.name,
        schema: GroupSchema,
    },
]);

@Module({})
export class GroupModule {
    static register(): DynamicModule {
        const imports: any[] = [];
        const providers: any[] = [groupServiceProvider];

        if (dbConfig.type === "mongodb") {
            imports.push(GroupModel);
            providers.push(MongoGroupService);
        } else if (dbConfig.type === "postgres") {
            providers.push(PostgresGroupService);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }

        return {
            module: GroupModule,
            imports,
            providers,
            exports: ["GroupService"],
        };
    }
}
