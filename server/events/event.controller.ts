import {
    Body,
    Controller,
    Get,
    Header,
    Logger,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res
} from "@nestjs/common";
import { CreateEventDTO, UpdateEventDTO } from "./dto/event.dto";
import { ApiTags } from "@nestjs/swagger";
import { FilterEventsDTO } from "./dto/filter.dto";
import type { BaseRequest } from "../types";
import type { Response } from "express";
import { FactCheckerOnly, Public } from "../auth/decorators/auth.decorator";
import { parse } from "url";
import { ObjectIdValidationPipe } from "../ai-task/pipes/objectid-validation.pipe";
import { ConfigService } from "@nestjs/config";
import { ViewService } from "../view/view.service";
import { EventsService } from "./event.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";

@Controller(":namespace?")
export class EventsController {
    private getSafeNamespaceRedirect(namespace?: string): string {
        if (!namespace) {
            return "/";
        }

        const isValid = /^[a-zA-Z0-9_-]+$/.test(namespace);
        return isValid ? `/${namespace}` : "/";
    }

    private readonly logger = new Logger(EventsController.name);

    constructor(
        private configService: ConfigService,
        private readonly eventsService: EventsService,
        private viewService: ViewService,
        private featureFlagService: FeatureFlagService,
    ) { }

    @FactCheckerOnly()
    @ApiTags("event")
    @Post("api/event")
    async create(@Body() newEvent: CreateEventDTO) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            throw new NotFoundException("Endpoint disabled");
        }
        return this.eventsService.create(newEvent);
    }

    @FactCheckerOnly()
    @ApiTags("event")
    @Patch("api/event/:id")
    async update(
        @Param("id", ObjectIdValidationPipe) eventId: string,
        @Body() updatedEvent: UpdateEventDTO
    ) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            throw new NotFoundException("Endpoint disabled");
        }
        return this.eventsService.update(eventId, updatedEvent);
    }

    @Public()
    @ApiTags("event")
    @Get("api/event")
    public async findAll(@Query() query: FilterEventsDTO) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            throw new NotFoundException("Endpoint disabled");
        }
        return this.eventsService.findAll(query);
    }

    @Public()
    @ApiTags("pages")
    @Get("event")
    @Header("Cache-Control", "max-age=60")
    public async eventPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            const namespace = this.getSafeNamespaceRedirect(req.params.namespace);
            return res.redirect(namespace);
        }

        const parsedUrl = parse(req.url, true);

        const queryObject = Object.assign(parsedUrl.query, {
            nameSpace: req.params.namespace,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
        });

        await this.viewService.render(
            req,
            res,
            "/event-page",
            queryObject
        );
    }

    @FactCheckerOnly()
    @ApiTags("pages")
    @Get("event/create")
    public async createEventPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            const namespace = this.getSafeNamespaceRedirect(req.params.namespace);
            return res.redirect(namespace);
        }

        const parsedUrl = parse(req.url, true);
        const queryObject = Object.assign(parsedUrl.query, {
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(
            req,
            res,
            "/event-create",
            queryObject
        );
    }

    @Public()
    @ApiTags("pages")
    @Get("event/:data_hash/:event_slug")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async eventViewPage(
        @Req() req: BaseRequest,
        @Res() res: Response,
    ) {
        if (!this.featureFlagService.isEnableEventsFeature()) {
            const namespace = this.getSafeNamespaceRedirect(req.params.namespace);
            return res.redirect(namespace);
        }

        const parsedUrl = parse(req.url, true);
        const { data_hash } = req.params;
        try {
            const event = await this.eventsService.findByHash(data_hash);

            if (!event) {
                this.logger.warn(`Event not found for hash: ${data_hash}`);
                throw new NotFoundException("Event not found");
            }

            const queryObject = Object.assign(parsedUrl.query, {
                event,
                namespace: req.params.namespace,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
            });

            await this.viewService.render(
                req,
                res,
                "/event-view-page",
                queryObject
            );
        } catch (error) {
            if (!(error instanceof NotFoundException)) {
                this.logger.error(`Error rendering event page: ${error.message}`, error.stack);
            }
            throw error;
        }
    }
}
