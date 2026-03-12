import { Event } from "../schema/event.schema";

export interface FindAllResponse {
    events: Event[];
    total: number;
}
