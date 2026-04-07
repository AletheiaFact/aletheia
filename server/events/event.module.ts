import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./schema/event.schema";
import { EventsController } from "./event.controller";
import { ConfigModule } from "@nestjs/config";
import { ViewModule } from "../view/view.module";
import { EventsService } from "./event.service";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { TopicModule } from "../topic/topic.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { Topic, TopicSchema } from "../topic/schemas/topic.schema";
import { FeatureFlagModule } from "../feature-flag/feature-flag.module";

const EventModel = MongooseModule.forFeature([
    {
        name: Event.name,
        schema: EventSchema,
    },
    {
        name: Topic.name,
        schema: TopicSchema,
    }
]);

@Module({
    imports: [
        EventModel,
        ConfigModule,
        ViewModule,
        AbilityModule,
        ClaimReviewModule,
        TopicModule,
        FeatureFlagModule,
    ],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule {}
