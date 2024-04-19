import {
    Body,
    ConflictException,
    Controller,
    Get,
    Header,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UnprocessableEntityException,
    UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { UsersService } from "./users.service";
import { parse } from "url";
import { ViewService } from "../view/view.service";
import { ConfigService } from "@nestjs/config";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import type { BaseRequest } from "../types";
import { Types } from "mongoose";
import { CreateUserDTO } from "./dto/create-user.dto";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import {
    CheckAbilities,
    AdminUserAbility,
} from "../auth/ability/ability.decorator";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { UtilService } from "../util";
import { GetUsersDTO } from "./dto/get-users.dto";

@Controller(":namespace?")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private viewService: ViewService,
        private configService: ConfigService,
        private util: UtilService
    ) {}

    @IsPublic()
    @ApiTags("pages")
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
    @ApiTags("pages")
    @Get("sign-up")
    public async signUp(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .render(req, res, "/sign-up", Object.assign(parsedUrl.query));
    }

    @IsPublic()
    @ApiTags("user")
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

    @ApiTags("admin")
    @Get("admin")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    public async admin(@Req() req: Request, @Res() res: Response) {
        const nameSpace = req.params.namespace;
        const parsedUrl = parse(req.url, true);
        const users = await this.usersService.findAll({
            searchName: "",
            project: {
                _id: 1,
                email: 1,
                name: 1,
                role: 1,
                badges: 1,
                state: 1,
                totp: 1,
                namespaces: 1,
            },
            nameSpaceSlug: nameSpace,
        });
        await this.viewService.getNextServer().render(
            req,
            res,
            "/admin-page",
            Object.assign(parsedUrl.query, {
                users,
                nameSpace,
            })
        );
    }

    @ApiTags("user")
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

    @ApiTags("user")
    @Put("api/user/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async updateUser(
        @Param("id") userId,
        @Body() updates: UpdateUserDTO,
        @Res() res,
        @Req() request
    ) {
        try {
            const user = await this.usersService.getById(userId);

            const shouldEdit = this.util.canEditUser(user, request);

            if (shouldEdit) {
                this.usersService
                    .updateUser(Types.ObjectId(userId), updates)
                    .then(() => {
                        res.status(200).json({
                            success: true,
                            message: "User updated successfully",
                        });
                    })
                    .catch((e) => {
                        res.status(500).json({ message: e.message });
                    });
            } else {
                res.status(403).json({
                    message: "Unauthorized to edit this user",
                });
            }
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    @ApiTags("pages")
    @Get("profile")
    public async profile(@Req() req: BaseRequest, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const user = await this.usersService.getById(req.user._id);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/profile-page",
            Object.assign(parsedUrl.query, {
                user,
                nameSpace: req.params.namespace,
            })
        );
    }

    @IsPublic()
    @ApiTags("user")
    @Get("api/user")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getAll(@Query() getUsers: GetUsersDTO) {
        return this.usersService.findAll(getUsers);
    }

    @IsPublic()
    @ApiTags("user")
    @Get("api/user/ory/:id")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getByOryId(@Param("id") oryId) {
        return this.usersService.getByOryId(oryId);
    }

    @ApiTags("user")
    @Get("api/user/:id")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getUser(@Param("id") userId) {
        const value = Types.ObjectId(userId);
        return this.usersService.getById(value);
    }
}
