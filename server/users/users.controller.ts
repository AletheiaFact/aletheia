import {
    Controller,
    Get,
    Post, Req,
    Request, Res,
    Response,
    UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { SessionGuard } from "../auth/session.guard";
import {parse} from "url";
import {ViewService} from "../view/view.service";

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private viewService: ViewService
    ) {}

    @UseGuards(SessionGuard)
    @Get("api/user/validate")
    async findAll(@Request() req): Promise<any> {
        return { login: true, user: req.user };
    }

    @UseGuards(LocalAuthGuard)
    @Post("api/user/signin")
    async login(@Request() req, @Response() res) {
        return req.logIn(req.user, (err) => {
            return res.send({ login: true });
        });
    }

    @Get("login")
    public async personalityList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        console.log("login");

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/login",
                Object.assign(parsedUrl.query, {})
            );
    }
}
