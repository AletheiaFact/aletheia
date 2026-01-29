import { Controller, Get, Header, Req, Res } from "@nestjs/common";
import { Public } from "../auth/decorators/auth.decorator";

@Controller("")
export class RootController {
    @Public()
    @Get("robots.txt")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    robots(@Res() res, @Req() req) {
        const host = req.protocol + "://" + req.get("host");
        res.type("text/plain").end(
            `User-agent: *\nDisallow: /api\nDisallow: /_next\nSitemap: ${host}/sitemap.xml`
        );
    }

    @Public()
    @Get("api/health")
    health() {
        return { status: "ok" };
    }
}
