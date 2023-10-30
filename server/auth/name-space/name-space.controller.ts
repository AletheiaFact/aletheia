import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
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

@Controller()
export class NameSpaceController {
    constructor(
        private nameSpaceService: NameSpaceService,
        private usersService: UsersService,
        private viewService: ViewService
    ) {}

    @ApiTags("name-space")
    @Post("api/name-space")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async create(@Body() namespace: CreateNameSpaceDTO) {
        return await this.nameSpaceService.create(namespace);
    }

    @ApiTags("name-space")
    @Put("api/name-space/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async update(@Param("id") id, @Body() namespace: UpdateNameSpaceDTO) {
        return await this.nameSpaceService.update(id, namespace);
    }

    @ApiTags("name-space")
    @Get("admin/name-spaces")
    public async adminNameSpaces(@Req() req: Request, @Res() res: Response) {
        const nameSpaces = await this.nameSpaceService.listAll();
        const users = await this.usersService.findAll({});
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/admin-namespaces",
                Object.assign(parsedUrl.query, { nameSpaces, users })
            );
    }
}
