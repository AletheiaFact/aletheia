import {
    Controller,
    Get, Post,
    Req,
    Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { NextApiRequest, NextApiResponse } from 'next'
import { parse } from "url";
import { ViewService } from "../view/view.service";
import OryService from "./ory.service";
import {IsPublic} from "../decorators/is-public.decorator";

@Controller()
export default class OryController {
    constructor(
        private configService: ConfigService,
        private viewService: ViewService,
        private oryService: OryService
    ) {}

    @IsPublic()
    @Get("api/.ory/*")
    public async getOryPaths(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .getRequestHandler()(
                req,
                res,
                parsedUrl,
            )
    }

    @IsPublic()
    @Post("api/.ory/*")
    public async oryPaths(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
        const parsedUrl = parse(req.url, true);
        await this.viewService
            .getNextServer()
            .getRequestHandler()(
                req,
                res,
                parsedUrl,
            )
    }
}
