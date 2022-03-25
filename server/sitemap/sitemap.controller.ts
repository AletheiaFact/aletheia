import {
    Controller,
    Get,
    Header,
    Request,
    Res,
    UseGuards,
} from "@nestjs/common";
import { SessionGuard } from "../auth/session.guard";
import { SitemapService } from "./sitemap.service";

@Controller("/")
export class SitemapController {
    constructor(private sitemapService: SitemapService) {}

    @Get("sitemap.xml")
    @Header("Content-Type", "text/xml")
    async getSitemap(@Res() res, @Request() req) {
        const sitemapXml = await this.sitemapService.getSitemap(
            req.protocol + "://" + req.get("host")
        );
        res.send(sitemapXml);
    }

    @UseGuards(SessionGuard)
    @Get("submit-sitemap")
    async submitSitemap(@Request() req) {
        return this.sitemapService.submitSitemap(
            req.protocol + "://" + req.get("host")
        );
    }
}
