import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
    Unattributed,
    UnattributedSchema,
} from "./mongo/schemas/unattributed.schema";
import { MongoUnattributedService } from "./mongo/unattributed.service";
import { PostgresUnattributedService } from "./postgres/unattributed.service";
import { unattributedServiceProvider } from "./unattributed.provider";
import dbConfig from "../../../config/db.config";

const UnattributedModel = MongooseModule.forFeature([
    {
        name: Unattributed.name,
        schema: UnattributedSchema,
    },
]);

@Module({})
export class UnattributedModule {
    static register(): DynamicModule {
        const imports: any[] = [];
        const providers: any[] = [unattributedServiceProvider];

        if (dbConfig.type === "mongodb") {
            imports.push(UnattributedModel);
            providers.push(MongoUnattributedService);
        } else if (dbConfig.type === "postgres") {
            providers.push(PostgresUnattributedService);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }

        return {
            module: UnattributedModule,
            imports: [...imports],
            providers,
            exports: ["UnattributedService"],
        };
    }
}
