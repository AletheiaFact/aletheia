import {
    Controller,
    Get,
    Query, Req,
    Res,
} from "@nestjs/common";
import {Request, Response} from "express";
import { UsersService } from "./users.service";
import { parse } from "url";
import { ViewService } from "../view/view.service";
import {ConfigService} from "@nestjs/config";
import {IsPublic} from "../decorators/is-public.decorator";
import { BaseRequest } from "../types";


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
