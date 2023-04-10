import { Body, Controller, Get, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { ImageService } from "../image/image.service";
import { parse } from "url";

import { ViewService } from "../view/view.service";
import { BadgeService } from "./badge.service";
import { CreateBadgeDTO } from "./dto/create-badge.dto";
import { UpdateBadgeDTO } from "./dto/update-badge.dto";
import { UsersService } from "../users/users.service";
import { Types } from "mongoose";

@Controller()
export class BadgeController {
    constructor(
        private badgeService: BadgeService,
        private viewService: ViewService,
        private imageService: ImageService,
        private usersService: UsersService
    ) {}

    @Post("api/badge")
    public async createBadge(@Body() badge: CreateBadgeDTO) {
        const { users, ...rest } = badge;
        if (!rest.image._id) {
            const image = await this.imageService.create(rest.image);
            rest.image = image;
        }

        const createdBadge = await this.badgeService.create(rest);
        createdBadge.image = rest.image;

        if (users) {
            users.forEach((user) => {
                {
                    this.usersService.updateUser(user._id, {
                        badges: [...user.badges, createdBadge._id],
                    });
                }
            });
        }

        return createdBadge;
    }

    @Put("api/badge/:id")
    public async updateBadge(@Body() badge: UpdateBadgeDTO) {
        const { users, ...rest } = badge;

        if (!rest.image._id) {
            const image = await this.imageService.create(rest.image);
            rest.image = Types.ObjectId(image._id);
        }

        const updatedBadge = await this.badgeService.update(rest);
        updatedBadge.image = rest.image;

        const usersWithBadge = await this.usersService.findAll({
            badges: Types.ObjectId(updatedBadge._id),
        });

        // Remove badge from users that no longer have it
        usersWithBadge.forEach((user) => {
            const userId = user._id.toString();
            const usersIds = users.map((user) => user._id);
            const isUserIdOnUsersList = usersIds.includes(userId);

            if (!isUserIdOnUsersList) {
                this.usersService.updateUser(user._id, {
                    badges: user.badges.filter(
                        (userBadge) =>
                            // @ts-ignore
                            userBadge._id.toString() !==
                            updatedBadge._id.toString()
                    ),
                });
            }
        });

        // Add badge to users that should now have it
        users.forEach((user) => {
            if (
                !user.badges?.some(
                    (userBadge) =>
                        userBadge._id !== Types.ObjectId(updatedBadge._id)
                )
            ) {
                this.usersService.updateUser(user._id, {
                    badges: [...user.badges, updatedBadge._id],
                });
            }
        });

        return updatedBadge;
    }

    @Get("api/badge")
    public async listBadges() {
        return this.badgeService.listAll();
    }

    @Get("admin/badges")
    public async adminBadges(@Req() req: Request, @Res() res: Response) {
        const badges = await this.badgeService.listAll();
        const users = await this.usersService.findAll({});
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/admin-badges",
                Object.assign(parsedUrl.query, { badges, users })
            );
    }
}
