import { Controller, Get, Param } from "@nestjs/common";

import { websocketService } from "./websocket.service";

@Controller()
export class websocketController {
    constructor(private readonly websocketService: websocketService) {}

    @Get()
    getHello(): string {
        return this.websocketService.getHello();
    }

    @Get("/:room")
    getRoom(@Param("room") room): string {
        return "room name" + room;
    }
}
