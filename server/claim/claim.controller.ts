import {
    BadRequestException,
    Controller,
    Get,
    Header,
    Inject,
    Logger,
    NotFoundException,
    Post,
    Put,
    Req,
} from "@nestjs/common";
import type { IClaimService } from "../interfaces/claim.service.interface";
import { SkipThrottle } from "@nestjs/throttler";
import { entityId } from "../../lib/schemas";
import {
    CreateClaimSchema,
    CreateDebateClaimSchema,
    CreateImageClaimSchema,
    CreateUnattributedClaimSchema,
    GetClaimQuerySchema,
    ListClaimsQuerySchema,
    UpdateClaimSchema,
    UpdateDebateSchema,
    UpdateHiddenStatusSchema,
} from "./dto/claim.dto";
import type {
    CreateClaimDto,
    CreateDebateClaimDto,
    CreateImageClaimDto,
    CreateUnattributedClaimDto,
    GetClaimQueryDto,
    ListClaimsQueryDto,
    UpdateClaimDto,
    UpdateDebateDto,
    UpdateHiddenStatusDto,
} from "./dto/claim.dto";
import { ZodBody, ZodParam, ZodQuery } from "../common/validation";
import { CaptchaService } from "../captcha/captcha.service";
import type { BaseRequest } from "../types";
import { Public, AdminOnly } from "../auth/decorators/auth.decorator";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import { DebateService } from "./types/debate/debate.service";
import { ParserService } from "./parser/parser.service";
import { Roles } from "../auth/ability/ability.factory";
import { ApiTags } from "@nestjs/swagger";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import type { IClaimRevisionService } from "../interfaces/claim-revision.service.interface";

@Controller(":namespace?")
export class ClaimController {
    private readonly logger = new Logger("ClaimController");
    constructor(
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService,
        @Inject("ClaimService") private claimService: IClaimService,
        private captchaService: CaptchaService,
        private debateService: DebateService,
        private parserService: ParserService,
        @Inject("ClaimRevisionService")
        private claimRevisionService: IClaimRevisionService
    ) {}

    _verifyInputsQuery(query: ListClaimsQueryDto) {
        const inputs: any = {
            isHidden: query.isHidden,
        };
        if (query.nameSpace) {
            inputs.nameSpace = query.nameSpace;
        }
        if (query.personality && !query.isHidden) {
            inputs.personalities = query.personality;
        }

        return inputs;
    }

    @Public()
    @ApiTags("claim")
    @Get("api/claim")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async listAll(
        @ZodQuery(ListClaimsQuerySchema) getClaimsDTO: ListClaimsQueryDto
    ) {
        const { page, pageSize, order } = getClaimsDTO;
        const queryInputs = this._verifyInputsQuery(getClaimsDTO);

        try {
            const claims = await this.claimService.listAll(
                page,
                pageSize,
                order,
                queryInputs
            );

            const totalPages = Math.ceil(claims.total / pageSize);

            this.logger.log(
                `Found ${claims.total} claims. Page ${page} of ${totalPages}`
            );

            return {
                claims: claims.data,
                totalClaims: claims.total,
                totalPages,
                page,
                pageSize,
            };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @ApiTags("claim")
    @Post("api/claim")
    async create(@ZodBody(CreateClaimSchema) createClaimDTO: CreateClaimDto) {
        const claim = await this._createClaim(createClaimDTO);
        const personality = await this.personalityService.getById(
            claim.personalities[0]
        );
        const path = claim.slug
            ? `/personality/${personality.slug}/claim/${claim.slug}`
            : `/personality/${personality.slug}`;
        return {
            _id: claim._id,
            title: claim.title,
            path:
                claim.nameSpace !== NameSpaceEnum.Main
                    ? `/${claim.nameSpace}${path}`
                    : path,
        };
    }

    @ApiTags("claim")
    @Post("api/claim/image")
    async createClaimImage(
        @ZodBody(CreateImageClaimSchema) createClaimDTO: CreateImageClaimDto
    ) {
        const claim = await this._createClaim(createClaimDTO);

        const personality = claim.personalities[0]
            ? await this.personalityService.getById(claim.personalities[0])
            : null;
        const path = personality
            ? `/personality/${personality.slug}/claim/${claim.slug}`
            : `/claim/${claim.slug}`;
        return {
            title: claim.title,
            path:
                claim.nameSpace !== NameSpaceEnum.Main
                    ? `/${claim.nameSpace}${path}`
                    : path,
        };
    }

    @ApiTags("claim")
    @Post("api/claim/debate")
    async createClaimDebate(
        @ZodBody(CreateDebateClaimSchema) createClaimDTO: CreateDebateClaimDto,
        @Req() req: BaseRequest
    ) {
        const claim = await this._createClaim(createClaimDTO);

        const userRole = (
            req.user?.role as Record<string, Roles> | undefined
        )?.[claim.nameSpace];
        const path =
            userRole === Roles.Admin || userRole === Roles.SuperAdmin
                ? `/claim/${claim._id}/debate/edit`
                : `/claim/${claim._id}/debate`;
        return {
            title: claim.title,
            path:
                claim.nameSpace !== NameSpaceEnum.Main
                    ? `/${claim.nameSpace}${path}`
                    : path,
        };
    }

    @ApiTags("claim")
    @Post("api/claim/unattributed")
    async createUnattributedClaim(
        @ZodBody(CreateUnattributedClaimSchema)
        createClaimDTO: CreateUnattributedClaimDto
    ) {
        const claim = await this._createClaim(createClaimDTO, true);

        return {
            title: claim.title,
            path:
                claim.nameSpace !== NameSpaceEnum.Main
                    ? `/${claim.nameSpace}/claim/${claim.slug}`
                    : `/claim/${claim.slug}`,
        };
    }

    @ApiTags("claim")
    @Put("api/claim/debate/:debateId")
    async updateClaimDebate(
        @ZodParam("debateId", entityId) debateId: string,
        @ZodBody(UpdateDebateSchema) updateClaimDebateDto: UpdateDebateDto
    ) {
        const { content, personality, isLive } = updateClaimDebateDto;
        let newSpeech;

        const claimRevision = await this.claimRevisionService.getByContentId(
            debateId
        );

        if (!claimRevision) {
            throw new NotFoundException();
        }
        const claimRevisionId = claimRevision._id;

        if (content && personality) {
            newSpeech = await this.parserService.parse(
                updateClaimDebateDto.content,
                claimRevisionId,
                updateClaimDebateDto.personality as any
            );

            await this.debateService.addSpeechToDebate(debateId, newSpeech._id);
            return newSpeech;
        } else {
            return this.debateService.updateDebateStatus(debateId, isLive);
        }
    }

    private async _createClaim(
        createClaimDTO:
            | CreateClaimDto
            | CreateImageClaimDto
            | CreateDebateClaimDto
            | CreateUnattributedClaimDto,
        overrideCaptchaValidation = false
    ) {
        if (!overrideCaptchaValidation) {
            const validateCaptcha = await this.captchaService.validate(
                createClaimDTO.recaptcha ?? ""
            );
            if (!validateCaptcha) {
                throw new BadRequestException("Error validating captcha");
            }
        }
        return this.claimService.create(createClaimDTO);
    }

    @Public()
    // Polled by every live debate viewer; visitors behind CGNAT share an IP.
    @SkipThrottle()
    @Get("api/claim/:id")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    @ApiTags("claim")
    getById(
        @ZodParam("id", entityId) claimId: string,
        @ZodQuery(GetClaimQuerySchema) query: GetClaimQueryDto
    ) {
        return this.claimService.getById(claimId, query.nameSpace);
    }

    @ApiTags("claim")
    @Put("api/claim/:id")
    update(
        @ZodParam("id", entityId) claimId: string,
        @ZodBody(UpdateClaimSchema) updateClaimDTO: UpdateClaimDto
    ) {
        return this.claimService.update(claimId, updateClaimDTO);
    }

    @AdminOnly()
    @ApiTags("claim")
    @Put("api/claim/hidden/:id")
    async updateHiddenStatus(
        @ZodParam("id", entityId) claimId: string,
        @ZodBody(UpdateHiddenStatusSchema) body: UpdateHiddenStatusDto
    ): Promise<unknown> {
        const validateCaptcha = await this.captchaService.validate(
            body.recaptcha
        );
        if (!validateCaptcha) {
            throw new BadRequestException("Error validating captcha");
        }

        return this.claimService.hideOrUnhideClaim(
            claimId,
            body.isHidden,
            body.description
        );
    }
}
