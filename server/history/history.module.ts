import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { History, HistorySchema } from "./schema/history.schema";
import { ConfigModule } from "@nestjs/config";
import { HistoryService } from "./history.service";
import { HistoryController } from "./history.controller";

const HistoryModel = MongooseModule.forFeature([
    {
        name: History.name,
        schema: HistorySchema,
    },
]);

@Module({
    imports: [HistoryModel, ConfigModule],
    exports: [HistoryService],
    providers: [HistoryService],
    controllers: [HistoryController],
})
export class HistoryModule {}
