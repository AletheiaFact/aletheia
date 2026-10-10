import { Controller, Get, Inject, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { IClaimRevisionService } from "../../interfaces/claim-revision.service.interface";

@Controller()
export class ClaimRevisionController {
    constructor(
        @Inject("ClaimRevisionService")
        private claimRevisionService: IClaimRevisionService
    ) {}

    @ApiTags("claim-revision")
    @Get("api/claim-revision/:id")
    async getById(@Param("id") id: string) {
        return await this.claimRevisionService.getRevisionById(id);
    }
}
