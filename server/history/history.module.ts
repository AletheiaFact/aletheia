import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { History, HistorySchema } from "./schema/history.schema";
import { ParserModule } from "../parser/parser.module";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { ViewModule } from "../view/view.module";
import { SourceModule } from "../source/source.module";
import { HistoryService } from "./history.service";

const HistoryModel = MongooseModule.forFeature([
    {
        name: History.name,
        schema: HistorySchema,
    },
]);

@Module({
    imports: [
        HistoryModel,
        ParserModule,
        ConfigModule,
        HttpModule,
        ViewModule,
        SourceModule,
    ],
    exports: [HistoryService],
    providers: [HistoryService],
})
export class HistoryModule {}