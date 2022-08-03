import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { StateEvent, StateEventDocument } from "./schema/state-event.schema";

@Injectable()
export class StateEventService {
    constructor(
        @InjectModel(StateEvent.name)
        private StateEventModel: Model<StateEventDocument>
    ) {}

    getStateEventParams(claimId, type, draft = false, taskId = null) {
        const date = new Date();
        return {
            claimId,
            type,
            taskId,
            draft,
            date,
        };
    }

    async createStateEvent(data) {
        const newStateEvent = new this.StateEventModel(data);
        return newStateEvent.save();
    }
}
