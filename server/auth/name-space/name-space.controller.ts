import { Body, Controller, Post } from "@nestjs/common";
import { NameSpaceService } from "./name-space.service";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class NameSpaceController {
    constructor(private nameSpaceService: NameSpaceService) {}

    @ApiTags("name-space")
    @Post("api/name-space")
    async create(@Body() namespace) {
        return await this.nameSpaceService.create(namespace);
    }
}
