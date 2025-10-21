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
} from "@nestjs/common";
import type { Request, Response } from "express";
import { UsersService } from "./users.service";
import { parse } from "url";
import { ViewService } from "../view/view.service";
import { ConfigService } from "@nestjs/config";
import type { BaseRequest } from "../types";
import { Types } from "mongoose";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { UtilService } from "../util";
import { GetUsersDTO } from "./dto/get-users.dto";
import { Public, AdminOnly, Auth } from "../auth/decorators/auth.decorator";

// TODO: check permissions for routes
@Controller(":namespace?")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private viewService: ViewService,
        private configService: ConfigService,
        private util: UtilService
    ) {}

    @ApiTags("pages")
    @Get("login")
    @Public()
    public async login(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const authType = this.configService.get<string>("authentication_type");

        const queryObject = Object.assign(parsedUrl.query, { authType });
        await this.viewService.render(req, res, "/login", queryObject);
    }

    @ApiTags("pages")
    @Get("sign-up")
    @Public()
    public async signUp(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            "/sign-up",
            Object.assign(parsedUrl.query)
        );
    }

    @ApiTags("user")
    @Post("api/user/register")
    @Public()
    public async register(@Body() createUserDto: CreateUserDTO) {
        try {
            return await this.usersService.register(createUserDto);
        } catch (errorResponse) {
            const { error } = errorResponse;
            if (error?.status === 409) {
                // Ory identity already exists
                throw new ConflictException(error?.message);
            }
            // Problems saving in database
            throw new UnprocessableEntityException(error?.message);
        }
    }

    @ApiTags("admin")
    @Get("admin")
    @AdminOnly()
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

        const queryObject = Object.assign(parsedUrl.query, {
            users,
            nameSpace,
        });

        await this.viewService.render(req, res, "/admin-page", queryObject);
    }

    @ApiTags("user")
    @Put("api/user/password-change")
    @Auth()
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
    @AdminOnly()
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
    @Auth()
    public async profile(@Req() req: BaseRequest, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const user = await this.usersService.getById(req.user._id);

        const queryObject = Object.assign(parsedUrl.query, {
            user,
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(req, res, "/profile-page", queryObject);
    }

    @ApiTags("user")
    @Get("api/user")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    @Public()
    public async getAll(@Query() getUsers: GetUsersDTO) {
        return this.usersService.findAll(getUsers);
    }

    @Public()
    @ApiTags("user")
    @Get("api/user/ory/:id")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getByOryId(@Param("id") oryId) {
        return this.usersService.getByOryId(oryId);
    }

    @ApiTags("user")
    @Get("api/user/:id")
    @Auth()
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getUser(@Param("id") userId) {
        const value = Types.ObjectId(userId);
        return this.usersService.getById(value);
    }
}
