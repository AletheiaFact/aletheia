import { Controller, Get, Inject } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { IClaimRevisionService } from "../../interfaces/claim-revision.service.interface";
import { ZodParam } from "../../common/validation";
import { entityId } from "../../../lib/schemas";

@Controller()
export class ClaimRevisionController {
    constructor(
        @Inject("ClaimRevisionService")
        private claimRevisionService: IClaimRevisionService
    ) {}

    @ApiTags("claim-revision")
    @Get("api/claim-revision/:id")
    async getById(@ZodParam("id", entityId) id: string) {
        return await this.claimRevisionService.getRevisionById(id);
    }
}
