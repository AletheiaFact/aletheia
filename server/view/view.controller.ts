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
import { ViewService } from "./view.service";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { ApiTags } from "@nestjs/swagger";

@Controller("/")
export class ViewController {
    constructor(
        private viewService: ViewService,
    ) { }

    async handler(req: Request, res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            parsedUrl.pathname,
            parsedUrl.query
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("about")
    @Header("Cache-Control", "max-age=86400")
    public async showAboutPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(req, res, "/about-page", parsedUrl.query);
    }

    @IsPublic()
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
    };
        
    @IsPublic()
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

    @IsPublic()
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

    @IsPublic()
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

    @IsPublic()
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

    @IsPublic()
    @Get("_next*")
    @Header("Cache-Control", "max-age=60")
    public async assets(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            parsedUrl.pathname,
            parsedUrl.query
        );
    }

    /**
     * Redirects to our custom 404 page.
     * The render404() method was not used here as it conflicts with our i18n strategy.
     */
    @IsPublic()
    @ApiTags("pages")
    @Get("404")
    @Header("Cache-Control", "max-age=86400")
    public async show404(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(req, res, "/404-page", parsedUrl.query);
    }

    @Get("totp")
    @Header("Cache-Control", "max-age=86400")
    public async showTotpCheck(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(
            req,
            res,
            "/totp-check-page",
            parsedUrl.query
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("unauthorized")
    public async acessDeniedPage(
        @Req() req: Request,
        @Res() res: Response,
        @Query() query: { originalUrl }
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
