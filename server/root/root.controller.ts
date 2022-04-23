import { Controller, Get, Req, Res } from "@nestjs/common";
import { IsPublic } from "../decorators/is-public.decorator";

@Controller("api")
export class RootController {
    @IsPublic()
    @Get("robots.txt")
    robots(@Res() res, @Req() req) {
        const host = req.protocol + "://" + req.get("host");
        res.type("text/plain").end(
            `User-agent: *\nDisallow: /api\nSitemap: ${host}/sitemap.xml`
        );
    }

    @IsPublic()
    @Get("health")
    health() {
        return { status: "ok" };
    }
}
