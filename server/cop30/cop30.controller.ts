import { Controller, Get } from "@nestjs/common";
import { Cop30Service } from "./cop30.service";

@Controller("api/cop30")
export class Cop30Controller {
    constructor(private readonly cop30Service: Cop30Service) {}

    @Get("sentences")
    async getAllSentencesWithCop30Topic() {
        return this.cop30Service.getAllSentencesWithCop30Topic();
    }
}
