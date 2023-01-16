import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DebateService } from "./debate.service";
import { Debate, DebateSchema } from "./schemas/debate.schema";

const DebateModel = MongooseModule.forFeature([
    {
        name: Debate.name,
        schema: DebateSchema,
    },
]);

@Module({
    imports: [DebateModel],
    providers: [DebateService],
    exports: [DebateService],
})
export class DebateModule {}
