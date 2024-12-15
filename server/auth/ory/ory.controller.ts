import { Controller, Get, Post, Header, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "url";
import { ViewService } from "../../view/view.service";
import { IsPublic } from "../decorators/is-public.decorator";
import OryService from "./ory.service";

@Controller("api/.ory")
export default class OryController {
    constructor(
        private readonly viewService: ViewService,
        private readonly oryService: OryService
    ) {}
    @IsPublic()
    @Get("sessions/whoami")
    public async whoAmI(@Req() req: Request, @Res() res: Response) {
        try {
            // forward cookie string because the cookie names may vary between ory cloud installations
            const data = await this.oryService.whoAmI(req.headers["cookie"]);
            return res.status(200).json(data);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.json());
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    @IsPublic()
    @Get("*")
    public async getOryPaths(
        @Req() req: NextApiRequest,
        @Res() res: NextApiResponse
    ) {
        await this.oryPaths(req, res);
    }

    @IsPublic()
    @Post("*")
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
        await this.viewService.getRequestHandler()(req, res, parsedUrl);
    }
}
