import {
    Controller,
    Get, Logger,
    Post, Put, Req,
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

@Controller()
export class UsersController {
    private readonly logger = new Logger("UserController");
    constructor(
        private readonly usersService: UsersService,
        private viewService: ViewService,
        private configService: ConfigService
    ) {}

    // TODO: this seems to be deprecated
    @Get("api/user/validate")
    async findAll(@Req() req): Promise<any> {
        return { login: true, user: req.user };
    }

    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post("api/user/signin")
    async login(@Req() req, @Res() res) {
        return req.logIn(req.user, (err) => {
            return res.send({ login: true });
        });
    }

    // TODO: move old logic to ory
    @Put("api/user/:id/password")
    async changePassword(@Req() req, @Res() res) {
        const { currentPassword, newPassword, repeatedNewPassword } = req.body;

        try {
            if (req.params.id !== req.user._id.toString()) {
                throw Error("Invalid user attempting to change password");
            }
            if (newPassword !== repeatedNewPassword) {
                throw Error("Repeated password doesn't match");
            }
            this.usersService
                .changePassword(new mongoose.Types.ObjectId(req.params.id), currentPassword, newPassword)
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
    public async profile(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/profile-page",
                Object.assign(parsedUrl.query, {})
            );
    }
}
