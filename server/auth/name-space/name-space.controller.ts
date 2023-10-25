import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
} from "@nestjs/common";
import { NameSpaceService } from "./name-space.service";
import type { Request, Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "../../users/users.service";
import { parse } from "url";
import { ViewService } from "../../view/view.service";

@Controller()
export class NameSpaceController {
    constructor(
        private nameSpaceService: NameSpaceService,
        private usersService: UsersService,
        private viewService: ViewService
    ) {}

    @ApiTags("name-space")
    @Post("api/name-space")
    async create(@Body() namespace) {
        return await this.nameSpaceService.create(namespace);
    }

    @ApiTags("name-space")
    @Put("api/name-space/:id")
    async update(@Param("id") id, @Body() namespace) {
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
