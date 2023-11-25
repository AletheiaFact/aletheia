import { ExecutionContext } from "@nestjs/common";
import { AdminUserMock } from "../utils/AdminUserMock";
import { Roles } from "../../auth/ability/ability.factory";

export const SessionGuardMock = {
    canActivate: (context: ExecutionContext) => {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        request.user = {
            _id: AdminUserMock._id,
            role: {
                main: Roles.Admin,
            },
        };
        return true;
    },
};
