import { Controller, Get, Res, Req } from "@nestjs/common";
import { Request, Response } from "express";
import { parse } from "url";
import { ViewService } from "./view.service";

@Controller("/")
export class ViewController {
    constructor(private viewService: ViewService) {}

    async handler(req: Request, res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        await this.viewService
            .getNextServer()
            .render(req, res, parsedUrl.pathname, parsedUrl.query);
    }

    @Get()
    public async showHome(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        await this.viewService
            .getNextServer()
            .render(req, res, "/landing-page", Object.assign(parsedUrl.query));
    }

    @Get("about")
    public async showAboutPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        await this.viewService
            .getNextServer()
            .render(req, res, "/about-page", Object.assign(parsedUrl.query));
    }

    @Get("privacy-policy")
    public async showPrivacyPolicyPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        await this.viewService
            .getNextServer()
            .render(req, res, "/privacy-policy-page", Object.assign(parsedUrl.query));
    }

    @Get("code-of-conduct")
    public async codeOfConductPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        await this.viewService
            .getNextServer()
            .render(req, res, "/code-of-conduct-page", Object.assign(parsedUrl.query));
    }

    @Get("_next*")
    public async assets(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        await this.viewService
            .getNextServer()
            .render(req, res, parsedUrl.pathname, parsedUrl.query);
    }
}
