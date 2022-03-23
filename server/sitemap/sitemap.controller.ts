import { Controller, Get, Request, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { SessionGuard } from "../auth/session.guard";
import { SitemapService } from "./sitemap.service";

@Controller("/")
export class SitemapController {
    constructor(private sitemapService: SitemapService) {}

    @Get("sitemap.xml")
    async getSitemap(@Res() res, @Request() req) {
        res.set("Content-Type", "text/xml");
        const host = req.protocol + "://" + req.get("host");
        const sitemapXml = await this.sitemapService.getSitemap(host);
        res.send(sitemapXml);
    }

    @UseGuards(SessionGuard)
    @Get("submit-sitemap")
    async submitSitemap(@Res() res: Response, @Request() req) {
        const host = req.protocol + "://" + req.get("host");
        this.sitemapService
            .submitSitemap(host)
            .then(() => res.send("Sitemap submited"))
            .catch((e) =>
                res.send("Error while submitting sitemap: " + e.message)
            );
    }
}
