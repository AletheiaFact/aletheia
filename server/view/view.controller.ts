import {
    Controller,
    Get,
    Res,
    Req,
    Header,
    Query,
    Param,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { parse } from "url";
import { ConfigService } from "@nestjs/config";
import { ViewService } from "./view.service";
import { CaptchaService } from "../captcha/captcha.service";
import { Public } from "../auth/decorators/auth.decorator";
import { ApiTags } from "@nestjs/swagger";

@Controller("/")
export class ViewController {
    constructor(
        private readonly viewService: ViewService,
        private readonly configService: ConfigService,
        private readonly captchaService: CaptchaService
    ) {}

    async handler(req: Request, res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            parsedUrl.pathname ?? "/",
            parsedUrl.query
        );
    }

    @Public()
    @ApiTags("pages")
    @Get("about")
    @Header("Cache-Control", "max-age=86400")
    public async showAboutPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(req, res, "/about-page", parsedUrl.query);
    }

    @Public()
    @ApiTags("pages")
    @Get("signup-invite")
    @Header("Cache-Control", "max-age=86400")
    public async signupInvite(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            "/signup-invite",
            parsedUrl.query
        );
    }

    @Public()
    @ApiTags("pages")
    @Get("about/:person")
    @Header("Cache-Control", "max-age=86400")
    public async showPersonAboutPage(
        @Param("person") person: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        // For now, redirect to the main about page
        // In the future, this will render person-specific about pages
        // The person parameter will be used to fetch specific person data
        res.redirect(302, "/about");
    }

    @Public()
    @ApiTags("pages")
    @Get("supportive-materials")
    @Header("Cache-Control", "max-age=86400")
    public async supportiveMaterialsPage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            "/supportive-materials",
            parsedUrl.query
        );
    }

    @Public()
    @ApiTags("pages")
    @Get("privacy-policy")
    @Header("Cache-Control", "max-age=86400")
    public async showPrivacyPolicyPage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            "/privacy-policy-page",
            parsedUrl.query
        );
    }

    @Public()
    @ApiTags("pages")
    @Get("committee-invitation")
    @Header("Cache-Control", "max-age=86400")
    public async committeeInvitationPage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        const queryObject = Object.assign(parsedUrl.query, {
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            captcha: this.captchaService.getClientConfig(),
        });
        await this.viewService.render(
            req,
            res,
            "/committee-invitation-page",
            queryObject
        );
    }

    @Public()
    @ApiTags("pages")
    @Get("code-of-conduct")
    @Header("Cache-Control", "max-age=86400")
    public async codeOfConductPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            "/code-of-conduct-page",
            parsedUrl.query
        );
    }

    /**
     * Files under /_next/static carry a content hash in the name, so a given
     * URL always returns the same bytes. They can stay in the browser and in
     * the CDN for a year. This route must come before the general "_next*"
     * route below, because Express matches routes in declaration order.
     */
    @Public()
    @Get("_next/static*")
    @Header("Cache-Control", "public, max-age=31536000, immutable")
    public async staticAssets(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            parsedUrl.pathname ?? "/",
            parsedUrl.query
        );
    }

    /**
     * Other /_next paths (the image optimizer, the data routes) change when
     * the content changes, so they get a short TTL.
     */
    @Public()
    @Get("_next*")
    @Header("Cache-Control", "public, max-age=60")
    public async assets(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            parsedUrl.pathname ?? "/",
            parsedUrl.query
        );
    }

    /**
     * Redirects to our custom 404 page.
     * The render404() method was not used here as it conflicts with our i18n strategy.
     */
    @Public()
    @ApiTags("pages")
    @Get("404")
    @Header("Cache-Control", "max-age=86400")
    public async show404(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(req, res, "/404-page", parsedUrl.query);
    }

    @Get("totp")
    @Header("Cache-Control", "private, max-age=86400")
    public async showTotpCheck(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            "/totp-check-page",
            parsedUrl.query
        );
    }

    @Public()
    @ApiTags("pages")
    @Get("unauthorized")
    public async acessDeniedPage(
        @Req() req: Request,
        @Res() res: Response,
        @Query() query: { originalUrl: string }
    ) {
        const parsedUrl = parse(req.url, true);
        const originalUrl = query.originalUrl;
        const queryObject = Object.assign(parsedUrl.query, {
            originalUrl,
        });
        await this.viewService.render(
            req,
            res,
            "/access-denied-page",
            queryObject
        );
    }
}
