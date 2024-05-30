import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ClaimRevisionService } from "./claim-revision.service";

@Controller()
export class ClaimRevisionController {
    constructor(private claimRevisionService: ClaimRevisionService) {}

    @ApiTags("claim-revision")
    @Get("api/claim-revision/:id")
    async getById(@Param("id") id: string) {
        return await this.claimRevisionService.getRevisionById(id);
    }
}
