import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { HistoryTrackService } from "./history-track.service";
import {
    HistoryTrack,
    HistoryTrackSchema,
} from "./schema/history-track.schema";

const HistoryTrackModel = MongooseModule.forFeature([
    {
        name: HistoryTrack.name,
        schema: HistoryTrackSchema,
    },
]);

@Module({
    imports: [HistoryTrackModel, ConfigModule],
    exports: [HistoryTrackService],
    providers: [HistoryTrackService],
})
export class HistoryTrackModule {}
