import { Controller, Get, Post, Req, Res, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "url";
import { ViewService } from "../../view/view.service";
import { Public } from "../decorators/auth.decorator";
import OryService from "./ory.service";
import { toError } from "../../util/error-handling";

/**
 * True when the request can carry an Ory session: a browser session cookie
 * (`ory_session_<project>` on Ory Cloud, `ory_kratos_session` on self-hosted
 * Kratos) or a native-app session token in `X-Session-Token`.
 */
export function hasOrySessionCredentials(req: Request): boolean {
    if (req.headers["x-session-token"]) {
        return true;
    }
    const cookieHeader = req.headers.cookie ?? "";
    return cookieHeader.split(";").some((pair) => {
        const name = pair.split("=")[0].trim().toLowerCase();
        return name.startsWith("ory_") && name.includes("session");
    });
}

@Controller("api/.ory")
export default class OryController {
    protected readonly logger = new Logger(OryController.name);

    constructor(
        private readonly viewService: ViewService,
        private readonly oryService: OryService
    ) {}

    @Public()
    @Get("sessions/whoami")
    public async whoAmI(@Req() req: Request, @Res() res: Response) {
        // Every page load calls whoami. Without session credentials the answer
        // is always "no session", so answer it here instead of calling Ory.
        // The answer is the same for every anonymous visitor, so Cloudflare
        // may cache it (s-maxage). Browsers must not (max-age=0): the URL is
        // the same after login, and a cached 401 would hide the new session.
        if (!hasOrySessionCredentials(req)) {
            res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60");
            return res.status(401).json({ message: "No active session" });
        }
        try {
            // forward cookie string because the cookie names may vary between ory cloud installations
            const data = await this.oryService.whoAmI(
                req.headers["cookie"] ?? ""
            );
            return res.status(200).json(data);
        } catch (error) {
            const err = toError(error);

            this.logger.error(`Request failed: ${err.message}`, err.stack);

            if (typeof err.status === "number") {
                return res
                    .status(err.status)
                    .json({ message: "Request failed" });
            }

            return res.status(500).json({ message: "Internal server error" });
        }
    }

    @Public()
    @Get("*")
    public async getOryPaths(
        @Req() req: NextApiRequest,
        @Res() res: NextApiResponse
    ) {
        await this.oryPaths(req, res);
    }

    @Public()
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
        const parsedUrl = parse(req.url!, true);
        await this.viewService.getRequestHandler()(
            req as any,
            res as any,
            parsedUrl
        );
    }
}
