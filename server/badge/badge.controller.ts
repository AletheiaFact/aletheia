import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { ImageService } from "../image/image.service";
import { parse } from "url";

import { ViewService } from "../view/view.service";
import { BadgeService } from "./badge.service";
import { CreateBadgeDTO } from "./dto/create-badge.dto";

@Controller()
export class BadgeController {
    constructor(
        private badgeService: BadgeService,
        private viewService: ViewService,
        private imageService: ImageService
    ) {}

    @Post("api/badge")
    public async createBadge(@Body() badge: CreateBadgeDTO) {
        // @ts-ignore
        if (!badge.image._id) {
            const image = await this.imageService.create(badge.image);
            badge.image = image;
        }
        const createdBadge = await this.badgeService.create(badge);
        createdBadge.image = badge.image;
        return createdBadge;
    }

    @Get("admin/badges")
    public async adminBadges(@Req() req: Request, @Res() res: Response) {
        const badges = await this.badgeService.listAll();
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/admin-badges",
                Object.assign(parsedUrl.query, { badges })
            );
    }
}
