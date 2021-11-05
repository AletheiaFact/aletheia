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
import { SessionGuard } from "../auth/session.guard";
import { parse } from "url";
import { ViewService } from "../view/view.service";
import * as mongoose from "mongoose";

@Controller()
export class UsersController {
    private readonly logger = new Logger("UserController");
    constructor(
        private readonly usersService: UsersService,
        private viewService: ViewService
    ) {}

    @UseGuards(SessionGuard)
    @Get("api/user/validate")
    async findAll(@Req() req): Promise<any> {
        return { login: true, user: req.user };
    }

    @UseGuards(LocalAuthGuard)
    @Post("api/user/signin")
    async login(@Req() req, @Res() res) {
        return req.logIn(req.user, (err) => {
            return res.send({ login: true });
        });
    }

    @UseGuards(SessionGuard)
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
            console.log(req.params.id, typeof currentPassword, typeof newPassword);
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

    @Get("login")
    public async personalityList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/login",
                Object.assign(parsedUrl.query, {})
            );
    }

    @UseGuards(SessionGuard)
    @Get("profile")
    public async profile(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

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
