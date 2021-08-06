import {
    Controller,
    Get,
    Post,
    Request,
    Response,
    UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { SessionGuard } from "../auth/session.guard";

@Controller("api/user")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(SessionGuard)
    @Get("validate")
    async findAll(@Request() req): Promise<any> {
        return { login: true, user: req.user };
    }

    @UseGuards(LocalAuthGuard)
    @Post("signin")
    async login(@Request() req, @Response() res) {
        return req.logIn(req.user, (err) => {
            return res.send({ login: true });
        });
    }
}
