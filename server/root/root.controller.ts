import { Controller, Get, Req, Res } from "@nestjs/common";

@Controller("api")
export class RootController {
    @Get("robots.txt")
    robots(@Res() res, @Req() req) {
        const host = req.protocol + "://" + req.get("host");
        res.type("text/plain").end(
            `User-agent: *\nDisallow: /api\nSitemap: ${host}/sitemap.xml`
        );
    }

    @Get("health")
    health() {
        return { status: "ok" };
    }
}
