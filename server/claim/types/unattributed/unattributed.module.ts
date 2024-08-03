import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
    Unattributed,
    UnattributedSchema,
} from "./schemas/unattributed.schema";
import { UnattributedService } from "./unattributed.service";

const UnattributedModel = MongooseModule.forFeature([
    {
        name: Unattributed.name,
        schema: UnattributedSchema,
    },
]);

@Module({
    imports: [UnattributedModel],
    providers: [UnattributedService],
    exports: [UnattributedService],
})
export class UnattributedModule {}
