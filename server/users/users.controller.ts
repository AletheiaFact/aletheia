import {
    Controller,
    Get, Logger,
    Post, Put, Query, Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import {Request, Response} from "express";
import { UsersService } from "./users.service";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { parse } from "url";
import { ViewService } from "../view/view.service";
import * as mongoose from "mongoose";
import {ConfigService} from "@nestjs/config";
import {IsPublic} from "../decorators/is-public.decorator";
import { BaseRequest } from "../types";


@Controller()
export class UsersController {
    private readonly logger = new Logger("UserController");
    constructor(
        private readonly usersService: UsersService,
        private viewService: ViewService,
        private configService: ConfigService
    ) {}

    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post("api/user/signin")
    async login(@Req() req, @Res() res) {
        return req.logIn(req.user, (err) => {
            return res.send({ login: true });
        });
    }

    @Put("api/user/:id/password")
    async changePassword(@Req() req: BaseRequest, @Res() res) {

        try {
            if (req.params.id !== req.user._id.toString()) {
                throw Error("Invalid user attempting to change password");
            }
                this.usersService.registerPasswordChange(mongoose.Types.ObjectId(req.params.id))
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: "Password reset successful"
                    });
                }).catch(e => {
                    this.logger.error(e);
                    res.status(500).json({ message: e.message });
                });
        } catch (e) {
            this.logger.error(e);
            res.status(500).json({ message: e.message });
        }
    }

    @IsPublic()
    @Get("login")
    public async personalityList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const authType = this.configService.get<string>("authentication_type")
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/login",
                Object.assign(parsedUrl.query, { authType })
            );
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
                Object.assign(parsedUrl.query, {user})
            );
    }

    @IsPublic()
    @Get("api/user")
    public async getAll(@Query() getUsers) {
        return this.usersService.findAll(getUsers);
    }
}
