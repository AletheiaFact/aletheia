import {Controller, Post, Get, Body, UseGuards} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import {SessionGuard} from "../auth/session.guard";
import { ClaimRevisionService } from "./claim-revision.service";

@Controller()
export class ClaimRevisionController {
    constructor(
        private readonly claimRevisionService: ClaimRevisionService,
        private configService: ConfigService,
        private httpService: HttpService
    ) {}

    @UseGuards(SessionGuard)
    @Get("api/claimRevision")
    async getHello() {
        return this.claimRevisionService.getHello();
    }

    @UseGuards(SessionGuard)
    @Post("api/claimRevision")
    async create(@Body() body) {
        return this.claimRevisionService.create(body);
    }
}
