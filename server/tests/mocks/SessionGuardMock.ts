import {ExecutionContext} from "@nestjs/common";
import {UserMock} from "../utils/UserMock";

export const SessionGuardMock = {
    canActivate: (context: ExecutionContext) => {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        request.user = { _id: UserMock._id };
        return true
    }
}
