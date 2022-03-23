import {
    Controller,
    Get,
    Req,
    Param,
    Query,
    Res,
    Post,
    Body,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { parse } from "url";
import { ViewService } from "../view/view.service";
import OryService from "./ory.service";

@Controller()
export default class OryController {
    constructor(
        private configService: ConfigService,
        private viewService: ViewService,
        private oryService: OryService
    ) {}

    @Get("ory-login")
    public async loginWithOry(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/ory-login-page",
                Object.assign(parsedUrl.query)
            );
    }

    @Get("api/.ory/*")
    public async oryPaths(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        console.log("chegou no ory paths");

        req.query = { ...req.query, paths: req.params };
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/api/.ory/[...paths]",
                Object.assign(parsedUrl.query, { paths: req.params })
            );
    }
}
