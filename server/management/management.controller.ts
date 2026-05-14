import {
    BadRequestException,
    Controller,
    Delete,
    Logger,
    Param,
} from "@nestjs/common";
import { ManagementService } from "./management.service";
import { ApiTags } from "@nestjs/swagger";
import { AdminOnly } from "../auth/decorators/auth.decorator";
import { HEX24_REGEX } from "../util/regex.util";

@ApiTags("management")
@Controller(":namespace?")
export class ManagementController {
    private readonly logger = new Logger("ManagementController");

    constructor(private readonly managementService: ManagementService) {}

    @AdminOnly()
    @Delete("api/personality/:id")
    async deletePersonality(@Param("id") personalityId: string) {
        if (!HEX24_REGEX.test(personalityId)) {
            throw new BadRequestException("Invalid personalityId format");
        }

        return this.managementService.deletePersonalityHierarchy(personalityId);
    }

    @AdminOnly()
    @Delete("api/claim/:id")
    async deleteClaim(@Param("id") claimId: string) {
        if (!HEX24_REGEX.test(claimId)) {
            throw new BadRequestException("Invalid claimId format");
        }

        return this.managementService.deleteClaimHierarchy(claimId);
    }
}
