import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./schema/event.schema";
import { EventsController } from "./event.controller";
import { ConfigModule } from "@nestjs/config";
import { ViewModule } from "../view/view.module";
import { EventsService } from "./event.service";
import { VerificationRequestModule } from "../verification-request/verification-request.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { TopicModule } from "../topic/topic.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { SentenceModule } from "../claim/types/sentence/sentence.module";
import { ImageModule } from "../claim/types/image/image.module";

const EventModel = MongooseModule.forFeature([
    {
        name: Event.name,
        schema: EventSchema,
    },
]);


@Module({
    imports: [
        EventModel,
        ConfigModule,
        ViewModule,
        AbilityModule,
        VerificationRequestModule,
        ClaimReviewModule,
        SentenceModule,
        ImageModule,
        TopicModule
    ],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule {}
