import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HistorySchema } from "./schema/history.schema";
import { ConfigModule } from "@nestjs/config";
import { HistoryService } from "./history.service";

const HistoryModel = MongooseModule.forFeature([
    {
        name: "HISTORY_MODEL",
        schema: HistorySchema,
    },
]);

@Module({
    imports: [
        HistoryModel,
        ConfigModule,
    ],
    exports: [HistoryService],
    providers: [HistoryService],
})

export class HistoryModule {}
