import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { StateEventService } from "./state-event.service";
import { StateEvent, StateEventSchema } from "./schema/state-event.schema";

const StateEventModel = MongooseModule.forFeature([
    {
        name: StateEvent.name,
        schema: StateEventSchema,
    },
]);

@Module({
    imports: [StateEventModel, ConfigModule],
    exports: [StateEventService],
    providers: [StateEventService],
})
export class StateEventModule {}
