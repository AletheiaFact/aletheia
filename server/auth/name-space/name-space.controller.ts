import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { NameSpaceService } from "./name-space.service";
import type { Request, Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "../../users/users.service";
import { parse } from "url";
import { ViewService } from "../../view/view.service";
import { CreateNameSpaceDTO } from "./dto/create-namespace.dto";
import { UpdateNameSpaceDTO } from "./dto/update-name-space.dto";
import {
    AdminUserAbility,
    CheckAbilities,
} from "../../auth/ability/ability.decorator";
import { AbilitiesGuard } from "../../auth/ability/abilities.guard";
import { Types } from "mongoose";
import { Roles } from "../../auth/ability/ability.factory";
import { NotificationService } from "../../notifications/notifications.service";
import slugify from "slugify";

@Controller()
export class NameSpaceController {
    constructor(
        private nameSpaceService: NameSpaceService,
        private usersService: UsersService,
        private viewService: ViewService,
        private notificationService: NotificationService
    ) {}

    @ApiTags("name-space")
    @Post("api/name-space")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
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

    @ApiTags("name-space")
    @Put("api/name-space/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async update(@Param("id") id, @Body() namespaceBody: UpdateNameSpaceDTO) {
        const nameSpace = await this.nameSpaceService.getById(id);
        const newNameSpace = {
            ...nameSpace.toObject(),
            ...namespaceBody,
        };

        newNameSpace.slug = slugify(nameSpace.name, {
            lower: true,
            strict: true,
        });

        newNameSpace.users = await this.updateNameSpaceUsers(
            newNameSpace.users,
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

    @ApiTags("name-space")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    @Get("api/name-space")
    async findAllOrFiltered(
        @Query("userId") userId?: string,
    ) {
        if (userId) {
            return this.nameSpaceService.findByUser(userId);
        }

        return this.nameSpaceService.listAll();
    }

    @ApiTags("name-space")
    @Get("admin/name-spaces")
    public async adminNameSpaces(@Req() req: Request, @Res() res: Response) {
        const nameSpaces = await this.nameSpaceService.listAll();
        const users = await this.usersService.findAll({});
        const parsedUrl = parse(req.url, true);

        const query = Object.assign(parsedUrl.query, { nameSpaces, users });

        await this.viewService.render(req, res, "/admin-namespaces", query);
    }

    private async updateNameSpaceUsers(users, key) {
        const promises = users.map(async (user) => {
            const userId = new Types.ObjectId(user._id);
            const existingUser = await this.usersService.getById(userId);

            if (!existingUser.role[key]) {
                await this.usersService.updateUser(existingUser._id, {
                    role: {
                        ...existingUser.role,
                        [key]: Roles.Regular,
                    },
                });
            }

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
            delete user.role[key];
            return this.usersService.updateUser(user._id, { role: user.role });
        });

        await Promise.all(updatePromises);
    }
}
