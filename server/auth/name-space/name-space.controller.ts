import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
} from "@nestjs/common";
import { NameSpaceService } from "./name-space.service";
import type { Request, Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "../../users/users.service";
import { parse } from "url";
import { ViewService } from "../../view/view.service";
import { CreateNameSpaceDTO } from "./dto/create-namespace.dto";
import { UpdateNameSpaceDTO } from "./dto/update-name-space.dto";
import { AdminOnly } from "../decorators/auth.decorator";
import { Types, UpdateWriteOpResult } from "mongoose";
import { Roles } from "../../auth/ability/ability.factory";
import { NotificationService } from "../../notifications/notifications.service";
import slugify from "slugify";
import { ConfigService } from "@nestjs/config";

@Controller()
export class NameSpaceController {
    constructor(
        private nameSpaceService: NameSpaceService,
        private usersService: UsersService,
        private viewService: ViewService,
        private notificationService: NotificationService,
        private configService: ConfigService
    ) {}

    @AdminOnly()
    @ApiTags("name-space")
    @Post("api/name-space")
    async create(@Body() namespace: CreateNameSpaceDTO) {
        namespace.slug = slugify(namespace.name, {
            lower: true,
            strict: true,
        });

        namespace.users = await this.updateNameSpaceUsers(
            namespace.users,
            namespace.slug
        );

        return await this.nameSpaceService.create(namespace);
    }

    @AdminOnly()
    @ApiTags("name-space")
    @Put("api/name-space/:id")
    async update(@Param("id") id, @Body() namespaceBody: UpdateNameSpaceDTO) {
        const nameSpace = await this.nameSpaceService.getById(id);
        if (!nameSpace) {
            throw new NotFoundException("Namespace not found");
        }
        const newNameSpace = {
            ...nameSpace.toObject(),
            ...namespaceBody,
        };

        newNameSpace.slug = slugify(newNameSpace.name ?? "", {
            lower: true,
            strict: true,
        });

        newNameSpace.users = await this.updateNameSpaceUsers(
            newNameSpace.users,
            newNameSpace.slug,
            nameSpace.slug
        );

        await this.findNameSpaceUsersAndDelete(
            id,
            nameSpace.slug,
            newNameSpace.users,
            nameSpace.users
        );

        return await this.nameSpaceService.update(id, newNameSpace);
    }

    @AdminOnly()
    @ApiTags("name-space")
    @Get("api/name-space")
    async findAllOrFiltered(@Query("userId") userId?: string) {
        if (userId) {
            return this.nameSpaceService.findByUser(userId);
        }

        return this.nameSpaceService.listAll();
    }

    @AdminOnly()
    @ApiTags("name-space")
    @Get("admin/name-spaces")
    public async adminNameSpaces(@Req() req: Request, @Res() res: Response) {
        const nameSpaces = await this.nameSpaceService.listAll();
        const users = await this.usersService.findAll({});
        const parsedUrl = parse(req.url, true);

        const query = Object.assign(parsedUrl.query, {
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            nameSpaces,
            users,
        });

        await this.viewService.render(req, res, "/admin-namespaces", query);
    }

    private async updateNameSpaceUsers(users, newKey, oldKey: string | null = null) {
        const promises = users.map(async (user) => {
            const userId = new Types.ObjectId(user._id);
            const existingUser = await this.usersService.getById(userId);
            if (!existingUser) {
                throw new NotFoundException(`User ${userId} not found`);
            }

            let updatedRoles = { ...existingUser.role };

            if (oldKey && oldKey !== newKey) {
                delete updatedRoles[oldKey];
            }

            updatedRoles[newKey] = Roles.Regular;

            await this.usersService.updateUser(existingUser._id, {
                role: updatedRoles,
            });

            return userId;
        });

        return await Promise.all(promises);
    }

    private async findNameSpaceUsersAndDelete(
        id,
        nameSpaceSlug,
        users,
        previousUsersId
    ) {
        const usersIdSet = new Set(users.map((user) => user.toString()));
        const nameSpaceUsersTodelete = previousUsersId.filter(
            (previousUserId) => !usersIdSet.has(previousUserId.toString())
        );

        if (nameSpaceUsersTodelete.length > 0) {
            this.notificationService.removeTopicSubscriber(
                id,
                nameSpaceUsersTodelete
            );
            return await this.deleteUsersNameSpace(
                nameSpaceUsersTodelete,
                nameSpaceSlug
            );
        }
    }

    private async deleteUsersNameSpace(usersId, key) {
        const updatePromises = usersId.map(async (userId) => {
            const id = new Types.ObjectId(userId);
            const user = await this.usersService.getById(id);
            if (!user) {
                throw new NotFoundException(`User ${id} not found`);
            }
            delete user.role[key];
            return this.usersService.updateUser(user._id, { role: user.role });
        });

        await Promise.all(updatePromises);
    }
}
