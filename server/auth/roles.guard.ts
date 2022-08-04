import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "../users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>(
            "roles",
            context.getHandler()
        );
        const request = context.switchToHttp().getRequest();

        if (request?.user) {
            const { _id } = request.user;
            const user = await this.userService.getById(_id);

            return roles.includes(user.role);
        }

        return false;
    }
}
