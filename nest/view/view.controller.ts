import { Controller, Get, Res, Req } from "@nestjs/common";
import { Request, Response } from "express";
import { parse } from "url";
import { ViewService } from "./view.service";

@Controller("/")
export class ViewController {
    constructor(private viewService: ViewService) {}

    async handler(req: Request, res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .render(req, res, parsedUrl.pathname, parsedUrl.query);
    }

    @Get("home")
    public async showHome(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                parsedUrl.pathname,
                Object.assign(parsedUrl.query)
            );
    }

    @Get("_next*")
    public async assets(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .render(req, res, parsedUrl.pathname, parsedUrl.query);
    }
}
