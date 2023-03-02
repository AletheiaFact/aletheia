import { Body, Controller, Get, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { ImageService } from "../image/image.service";
import { parse } from "url";

import { ViewService } from "../view/view.service";
import { BadgeService } from "./badge.service";
import { CreateBadgeDTO } from "./dto/create-badge.dto";
import { UpdateBadgeDTO } from "./dto/update-badge.dto";

@Controller()
export class BadgeController {
    constructor(
        private badgeService: BadgeService,
        private viewService: ViewService,
        private imageService: ImageService
    ) {}

    @Post("api/badge")
    public async createBadge(@Body() badge: CreateBadgeDTO) {
        if (!badge.image._id) {
            const image = await this.imageService.create(badge.image);
            badge.image = image;
        }
        const createdBadge = await this.badgeService.create(badge);
        createdBadge.image = badge.image;
        return createdBadge;
    }

    @Put("api/badge/:id")
    public async updateBadge(@Body() badge: UpdateBadgeDTO) {
        if (!badge.image._id) {
            const image = await this.imageService.create(badge.image);
            badge.image = image;
        }
        const updatedBadge = await this.badgeService.update(badge);
        updatedBadge.image = badge.image;
        return updatedBadge;
    }

    @Get("api/badge")
    public async listBadges() {
        return this.badgeService.listAll();
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
