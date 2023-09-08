import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "url";
import { ViewService } from "../../view/view.service";
import OryService from "./ory.service";
import { IsPublic } from "../decorators/is-public.decorator";

@Controller()
export default class OryController {
    constructor(private viewService: ViewService) {}

    @IsPublic()
    @Get("api/.ory/*")
    public async getOryPaths(
        @Req() req: NextApiRequest,
        @Res() res: NextApiResponse
    ) {
        await this.oryPaths(req, res);
    }

    @IsPublic()
    @Post("api/.ory/*")
    public async postOryPaths(
        @Req() req: NextApiRequest,
        @Res() res: NextApiResponse
    ) {
        await this.oryPaths(req, res);
    }

    private async oryPaths(
        @Req() req: NextApiRequest,
        @Res() res: NextApiResponse
    ) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.getNextServer().getRequestHandler()(
            req,
            res,
            parsedUrl
        );
    }
}
