import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { parse } from "url";
import { z } from "zod";
import { Public } from "../auth/decorators/auth.decorator";
import { ZodBody, ZodParam, ZodQuery } from "../common/validation";
import { ViewService } from "../view/view.service";
import type { ConsentDecision } from "./mcp-oauth-provider.service";
import { McpOAuthProviderService } from "./mcp-oauth-provider.service";
import {
    MCP_OAUTH_CONSENT_API_PATH,
    MCP_OAUTH_CONSENT_PAGE_PATH,
    MCP_OAUTH_LOGIN_PATH,
} from "./mcp.constants";

const LoginQuerySchema = z.object({ login_challenge: z.string().min(1) });
const ChallengeSchema = z.string().min(1);
const ConsentDecisionSchema = z.object({
    decision: z.enum(["accept", "reject"]),
});

/**
 * Hydra login and consent endpoints. Routes are public because the Kratos
 * session cookie is checked by McpOAuthProviderService, not by SessionGuard
 * (an unauthenticated visitor must reach the login redirect, not a 401).
 */
@Controller()
export class McpOAuthProviderController {
    constructor(
        private readonly provider: McpOAuthProviderService,
        private readonly viewService: ViewService
    ) {}

    @Public()
    @Get(MCP_OAUTH_LOGIN_PATH)
    async login(
        @ZodQuery(LoginQuerySchema) query: z.infer<typeof LoginQuerySchema>,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const selfUrl = `${req.protocol}://${req.get("host")}${
            req.originalUrl
        }`;
        const redirectTo = await this.provider.resolveLogin(
            query.login_challenge,
            req.headers.cookie,
            selfUrl
        );
        res.redirect(redirectTo);
    }

    @Public()
    @Get(MCP_OAUTH_CONSENT_PAGE_PATH)
    async consentPage(@Req() req: Request, @Res() res: Response) {
        await this.viewService.render(
            req,
            res,
            "/mcp-consent-page",
            parse(req.url, true).query
        );
    }

    @Public()
    @Get(`${MCP_OAUTH_CONSENT_API_PATH}/:challenge`)
    getConsent(
        @ZodParam("challenge", ChallengeSchema) challenge: string,
        @Req() req: Request
    ) {
        return this.provider.getConsent(challenge, req.headers.cookie);
    }

    @Public()
    @Post(`${MCP_OAUTH_CONSENT_API_PATH}/:challenge`)
    async decideConsent(
        @ZodParam("challenge", ChallengeSchema) challenge: string,
        @ZodBody(ConsentDecisionSchema)
        body: { decision: ConsentDecision },
        @Req() req: Request
    ) {
        const redirectTo = await this.provider.decideConsent(
            challenge,
            body.decision,
            req.headers.cookie
        );
        return { redirectTo };
    }
}
