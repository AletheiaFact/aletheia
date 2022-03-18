import { Controller, Get, Request, Response } from "@nestjs/common";
import { SitemapService } from "./sitemap.service";

@Controller("/")
export class SitemapController {
    constructor(private sitemapService: SitemapService) {}
    @Get("sitemap.xml")
    async getSitemap(@Response() res, @Request() req) {
        res.set("Content-Type", "text/xml");
        const host = req.protocol + "://" + req.get("host");
        const sitemapXml = await this.sitemapService.getSitemap(host);
        res.send(sitemapXml);
    }
}
