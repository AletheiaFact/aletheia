import { Controller, Get, Header, Req, Res } from "@nestjs/common";
import { IsPublic } from "../auth/decorators/is-public.decorator";

@Controller("")
export class RootController {
    @IsPublic()
    @Get("robots.txt")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    robots(@Res() res, @Req() req) {
        const host = req.protocol + "://" + req.get("host");
        res.type("text/plain").end(
            `User-agent: *\nDisallow: /api\nDisallow: /_next\nSitemap: ${host}/sitemap.xml`
        );
    }

    @IsPublic()
    @Get("api/health")
    health() {
        return { status: "ok" };
    }
}
