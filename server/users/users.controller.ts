import {
    Controller,
    Get,
    Header,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { parse } from "url";
import { ViewService } from "../view/view.service";
import { ConfigService } from "@nestjs/config";
import { IsPublic } from "../decorators/is-public.decorator";
import { BaseRequest } from "../types";
import { Types } from "mongoose";
import { AbilitiesGuard } from "../ability/abilities.guard";
import { CheckAbilities, AdminUserAbility } from "../ability/ability.decorator";

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private viewService: ViewService,
        private configService: ConfigService
    ) {}

    @IsPublic()
    @Get("login")
    public async personalityList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const authType = this.configService.get<string>("authentication_type");
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/login",
                Object.assign(parsedUrl.query, { authType })
            );
    }

    @Get("admin")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    public async admin(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .render(req, res, "/admin-page", Object.assign(parsedUrl.query));
    }

    @Put("api/user/:id/password")
    async changePassword(@Req() req: BaseRequest, @Res() res) {
        try {
            this.usersService
                .registerPasswordChange(Types.ObjectId(req.params.id))
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: "Password reset successful",
                    });
                })
                .catch((e) => {
                    res.status(500).json({ message: e.message });
                });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    @Get("profile")
    public async profile(@Req() req: BaseRequest, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const user = await this.usersService.getById(req.user._id);

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/profile-page",
                Object.assign(parsedUrl.query, { user })
            );
    }

    @IsPublic()
    @Get("api/user")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getAll(@Query() getUsers) {
        return this.usersService.findAll(getUsers);
    }
}
