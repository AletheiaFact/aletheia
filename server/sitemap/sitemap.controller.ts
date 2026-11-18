import { Controller, Get, Header } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SitemapService } from "./sitemap.service";
import { Public } from "../auth/decorators/auth.decorator";

@Controller("/")
export class SitemapController {
    constructor(
        private sitemapService: SitemapService,
        private configService: ConfigService
    ) {}

    /**
     * The sitemap is cached for a day, so its links use the configured
     * `baseUrl` instead of the request Host header, which clients control.
     */
    @Public()
    @Get("sitemap.xml")
    @Header("Content-Type", "text/xml")
    @Header("Cache-Control", "max-age=86400")
    async getSitemap(): Promise<Buffer> {
        return this.sitemapService.getSitemap(
            this.configService.getOrThrow<string>("baseUrl")
        );
    }
}
