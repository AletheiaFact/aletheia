import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { parse } from "url";

import { ViewService } from "../view/view.service";
import { BadgeService } from "./badge.service";
import { CreateBadgeDTO } from "./dto/create-badge.dto";

@Controller()
export class BadgeController {
    constructor(
        private badgeService: BadgeService,
        private viewService: ViewService
    ) {}

    @Post("api/badge/create")
    public async createBadge(@Body() badge: CreateBadgeDTO) {
        const createdBadge = await this.badgeService.create(badge);
        return createdBadge;
    }

    @Get("admin/badges")
    public async adminBadges(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .render(req, res, "/admin-badges", Object.assign(parsedUrl.query));
    }
}
