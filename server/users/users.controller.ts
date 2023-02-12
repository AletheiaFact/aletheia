import {
    Body,
    ConflictException,
    Controller,
    Get,
    Header,
    Post,
    Put,
    Query,
    Req,
    Res,
    UnprocessableEntityException,
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
import { CreateUserDTO } from "./dto/create-user.dto";
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
    public async login(@Req() req: Request, @Res() res: Response) {
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

    @IsPublic()
    @Get("sign-up")
    public async signUp(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .render(req, res, "/sign-up", Object.assign(parsedUrl.query));
    }

    @IsPublic()
    @Post("api/user/register")
    public async register(@Body() createUserDto: CreateUserDTO) {
        try {
            return await this.usersService.register(createUserDto);
        } catch (error) {
            if (error.response?.status === 409) {
                // Ory identity already exists
                throw new ConflictException(error.message);
            }
            // Problems saving in database
            throw new UnprocessableEntityException(error.message);
        }
    }

    @Get("admin")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    public async admin(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const users = await this.usersService.findAll({
            searchName: "",
            project: {
                _id: 1,
                email: 1,
                name: 1,
                role: 1,
            },
        });
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/admin-page",
                Object.assign(parsedUrl.query, { users })
            );
    }

    @Put("api/user/password-change")
    async changePassword(@Req() req: BaseRequest, @Res() res) {
        try {
            this.usersService
                .registerPasswordChange(Types.ObjectId(req.user._id))
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

    @UseGuards(AbilitiesGuard)
    @Put("api/user/update-role")
    @CheckAbilities(new AdminUserAbility())
    async updateRole(@Req() req: BaseRequest, @Res() res) {
        try {
            this.usersService
                .updateUserRole(Types.ObjectId(req.body.id), req.body.role)
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: "Role updated successfully",
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
