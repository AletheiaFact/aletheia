import { Controller, Get, Res } from "@nestjs/common";

@Controller()
export class RootController {
    @Get("robots.txt")
    robots(@Res() res) {
        res.type("text/plain").end("User-agent: *\nDisallow: /api\n");
    }

    @Get("health")
    health() {
        return { status: "ok" };
    }
}
