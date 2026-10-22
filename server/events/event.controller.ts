import {
    Controller,
    Get,
    Header,
    Logger,
    NotFoundException,
    Patch,
    Post,
    Req,
    Res,
} from "@nestjs/common";
import {
    CreateEventDto,
    CreateEventSchema,
    UpdateEventDto,
    UpdateEventSchema,
} from "./dto/event.dto";
import { ApiTags } from "@nestjs/swagger";
import {
    FilterEventsQueryDto,
    FilterEventsQuerySchema,
} from "./dto/filter.dto";
import type { BaseRequest } from "../types";
import type { Response } from "express";
import { FactCheckerOnly, Public } from "../auth/decorators/auth.decorator";
import { parse } from "url";
import { objectId } from "../../lib/schemas";
import { ZodBody, ZodParam, ZodQuery } from "../common/validation";
import { ConfigService } from "@nestjs/config";
import { ViewService } from "../view/view.service";
import { EventsService } from "./event.service";
import { toError } from "../util/error-handling";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { CaptchaService } from "../captcha/captcha.service";

@Controller(":namespace?")
export class EventsController {
    /** "/<namespace>" for a well-formed namespace, "" otherwise. */
    private namespacePrefix(namespace?: string): string {
        return namespace && /^[a-zA-Z0-9_-]+$/.test(namespace)
            ? `/${namespace}`
            : "";
    }

    private getSafeNamespaceRedirect(namespace?: string): string {
        return this.namespacePrefix(namespace) || "/";
    }

    private readonly logger = new Logger(EventsController.name);

    constructor(
        private configService: ConfigService,
        private readonly eventsService: EventsService,
        private viewService: ViewService,
        private featureFlagService: FeatureFlagService,
        private readonly captchaService: CaptchaService
    ) {}

    @FactCheckerOnly()
    @ApiTags("event")
    @Post("api/event")
    async create(@ZodBody(CreateEventSchema) newEvent: CreateEventDto) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            throw new NotFoundException("Endpoint disabled");
        }
        return this.eventsService.create(newEvent);
    }

    @FactCheckerOnly()
    @ApiTags("event")
    @Patch("api/event/:id")
    async update(
        @ZodParam("id", objectId) eventId: string,
        @ZodBody(UpdateEventSchema) updatedEvent: UpdateEventDto
    ) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            throw new NotFoundException("Endpoint disabled");
        }
        return this.eventsService.update(eventId, updatedEvent);
    }

    @Public()
    @ApiTags("event")
    @Get("api/event")
    public async findAll(
        @ZodQuery(FilterEventsQuerySchema) query: FilterEventsQueryDto
    ) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            throw new NotFoundException("Endpoint disabled");
        }
        return this.eventsService.findAll(query);
    }

    @Public()
    @ApiTags("pages")
    @Get("event")
    @Header("Cache-Control", "max-age=60")
    public async eventPage(@Req() req: BaseRequest, @Res() res: Response) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            const namespace = this.getSafeNamespaceRedirect(
                req.params.namespace
            );
            return res.redirect(namespace);
        }

        const parsedUrl = parse(req.url, true);

        const queryObject = Object.assign(parsedUrl.query, {
            nameSpace: req.params.namespace,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            captcha: this.captchaService.getClientConfig(),
        });

        await this.viewService.render(req, res, "/event-page", queryObject);
    }

    @FactCheckerOnly()
    @ApiTags("pages")
    @Get("event/create")
    public async createEventPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            const namespace = this.getSafeNamespaceRedirect(
                req.params.namespace
            );
            return res.redirect(namespace);
        }

        const parsedUrl = parse(req.url, true);
        const queryObject = Object.assign(parsedUrl.query, {
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            captcha: this.captchaService.getClientConfig(),
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(req, res, "/event-create", queryObject);
    }

    // Registered after event/create so "create" never resolves as a slug.
    @Public()
    @ApiTags("pages")
    @Get("event/:slug")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async eventViewPage(@Req() req: BaseRequest, @Res() res: Response) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            const namespace = this.getSafeNamespaceRedirect(
                req.params.namespace
            );
            return res.redirect(namespace);
        }

        const parsedUrl = parse(req.url, true);
        try {
            const event = await this.eventsService.findBySlug(req.params.slug);

            const queryObject = Object.assign(parsedUrl.query, {
                event,
                nameSpace: req.params.namespace,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                captcha: this.captchaService.getClientConfig(),
            });

            await this.viewService.render(
                req,
                res,
                "/event-view-page",
                queryObject
            );
        } catch (error) {
            if (!(error instanceof NotFoundException)) {
                const err = toError(error);
                this.logger.error(
                    `Error rendering event page: ${err.message}`,
                    err.stack
                );
            }
            throw error;
        }
    }

    // Legacy /event/:data_hash/:slug links (already shared publicly) keep
    // working through a permanent redirect to the slug URL.
    @Public()
    @ApiTags("pages")
    @Get("event/:data_hash/:event_slug")
    public async legacyEventViewPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            return res.redirect(
                this.getSafeNamespaceRedirect(req.params.namespace)
            );
        }

        const slug = await this.eventsService.getSlugByHash(
            req.params.data_hash
        );
        if (!slug) {
            throw new NotFoundException("Event not found");
        }
        const prefix = this.namespacePrefix(req.params.namespace);
        return res.redirect(301, `${prefix}/event/${encodeURIComponent(slug)}`);
    }
}
