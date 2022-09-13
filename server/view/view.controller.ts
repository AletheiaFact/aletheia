import { Controller, Get, Res, Req } from "@nestjs/common";
import { Request, Response } from "express";
import { parse } from "url";
import { ViewService } from "./view.service";
import { IsPublic } from "../decorators/is-public.decorator";
import { UnleashService } from "nestjs-unleash";
import { ConfigService } from "@nestjs/config";

@Controller("/")
export class ViewController {
    constructor(
        private viewService: ViewService,
        private readonly unleash: UnleashService,
        private configService: ConfigService
    ) {}

    async handler(req: Request, res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService
            .getNextServer()
            .render(req, res, parsedUrl.pathname, parsedUrl.query);
    }

    @IsPublic()
    @Get("about")
    public async showAboutPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        const config = this.configService.get<string>("feature_flag");

        const enableWarningDocument = config
            ? this.unleash.isEnabled("enable-warning-document")
            : true;

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/about-page",
                Object.assign(parsedUrl.query, { enableWarningDocument })
            );
    }

    @IsPublic()
    @Get("privacy-policy")
    public async showPrivacyPolicyPage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/privacy-policy-page",
                Object.assign(parsedUrl.query)
            );
    }

    @IsPublic()
    @Get("code-of-conduct")
    public async codeOfConductPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/code-of-conduct-page",
                Object.assign(parsedUrl.query)
            );
    }

    @IsPublic()
    @Get("_next*")
    public async assets(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService
            .getNextServer()
            .render(req, res, parsedUrl.pathname, parsedUrl.query);
    }

    /**
     * Redirects to our custom 404 page.
     * The render404() method was not used here as it conflicts with our i18n strategy.
     */
    @IsPublic()
    @Get("404")
    public async show404(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService
            .getNextServer()
            .render(req, res, "/404-page", Object.assign(parsedUrl.query));
    }
}
