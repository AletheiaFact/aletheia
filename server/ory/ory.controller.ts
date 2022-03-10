import {Controller, Get, Req, Param, Query, Res, Post, Body} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {Request, Response} from "express";
import {parse} from "url";
import {ViewService} from "../view/view.service";
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

    @Get("ory-signup")
    public async signupWithOry(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        const flow = await this.oryService.browser()

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/ory-signup-page",
                Object.assign({ ...parsedUrl.query, flow })
            );
    }

    @Post('api/kratos/public/self-service/registration')
    async oryRegistrationFlows(@Query('flow') flow, @Body() body) {
        console.log(flow, body)
        return this.oryService.submit(flow, body)
    }
}
