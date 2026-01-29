import { Controller, Get, Header, Request, Res } from "@nestjs/common";
import { SitemapService } from "./sitemap.service";
import { Public } from "../auth/decorators/auth.decorator";

@Controller("/")
export class SitemapController {
    constructor(private sitemapService: SitemapService) {}

    @Public()
    @Get("sitemap.xml")
    @Header("Content-Type", "text/xml")
    @Header("Cache-Control", "max-age=86400")
    async getSitemap(@Res() res, @Request() req) {
        const sitemapXml = await this.sitemapService.getSitemap(
            req.protocol + "://" + req.get("host")
        );
        res.send(sitemapXml);
    }

    @Get("submit-sitemap")
    async submitSitemap(@Request() req) {
        return this.sitemapService.submitSitemap(
            req.protocol + "://" + req.get("host")
        );
    }
}
