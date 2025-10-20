import { ExecutionContext } from "@nestjs/common";

export const M2MGuardMock = {
    canActivate: (context: ExecutionContext) => {
        // In tests, we don't expect M2M authentication to pass
        // This guard will return false so that SessionGuard takes over
        return false;
    },
};
