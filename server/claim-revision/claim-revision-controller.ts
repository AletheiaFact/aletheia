import { Controller, Get, Param } from "@nestjs/common";
import { ClaimRevisionService } from "./claim-revision.service";
@Controller("api/claim")
export class ClaimRevisionController {
    constructor(
        private claimRevisionService: ClaimRevisionService,
    ) {}
    @Get("revision/:revisionId")
    get(@Param("revisionId") revisionId) {
        return this.claimRevisionService.getRevision(revisionId);
    }
}