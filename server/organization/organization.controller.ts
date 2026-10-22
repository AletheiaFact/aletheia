import {
    BadRequestException,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Patch,
    Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { objectId } from "../../lib/schemas";
import { FactCheckerOnly } from "../auth/decorators/auth.decorator";
import { ImageService } from "../claim/types/image/image.service";
import { ZodBody, ZodParam, ZodQuery } from "../common/validation";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import type { IOrganizationService } from "../interfaces/organization.service.interface";
import {
    CreateOrganizationDto,
    CreateOrganizationSchema,
    OrganizationLogoDto,
    SearchOrganizationsQueryDto,
    SearchOrganizationsQuerySchema,
    UpdateOrganizationDto,
    UpdateOrganizationSchema,
} from "./dto/organization.dto";

@Controller(":namespace?")
export class OrganizationController {
    constructor(
        @Inject("OrganizationService")
        private readonly organizationService: IOrganizationService,
        private readonly imageService: ImageService,
        private readonly featureFlagService: FeatureFlagService
    ) {}

    @FactCheckerOnly()
    @ApiTags("organization")
    @Get("api/organization")
    search(
        @ZodQuery(SearchOrganizationsQuerySchema)
        query: SearchOrganizationsQueryDto
    ) {
        this.assertFeatureEnabled();
        return this.organizationService.search(query.name, query.limit);
    }

    @FactCheckerOnly()
    @ApiTags("organization")
    @Post("api/organization")
    async create(
        @ZodBody(CreateOrganizationSchema) organization: CreateOrganizationDto
    ) {
        this.assertFeatureEnabled();
        const logo = await this.resolveLogoId(organization.logo);
        return this.organizationService.create({ ...organization, logo });
    }

    @FactCheckerOnly()
    @ApiTags("organization")
    @Patch("api/organization/:id")
    async update(
        @ZodParam("id", objectId) id: string,
        @ZodBody(UpdateOrganizationSchema) organization: UpdateOrganizationDto
    ) {
        this.assertFeatureEnabled();
        const { logo, ...fields } = organization;
        return this.organizationService.update(id, {
            ...fields,
            ...(logo && { logo: await this.resolveLogoId(logo) }),
        });
    }

    // Organizations only exist to be shown on events, so they share its flag.
    private assertFeatureEnabled() {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            throw new NotFoundException("Endpoint disabled");
        }
    }

    private async resolveLogoId(logo: OrganizationLogoDto): Promise<string> {
        if ("_id" in logo) {
            if (!(await this.imageService.getById(logo._id))) {
                throw new BadRequestException("Unknown logo image");
            }
            return logo._id;
        }
        const image = await this.imageService.create(logo);
        return String(image._id);
    }
}
