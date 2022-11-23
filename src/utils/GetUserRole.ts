import { ory } from "../lib/orysdk";
import { Roles } from "../types/enums";

export const GetUserRole = () => {
    return ory
        .toSession()
        .then((session) => {
            return {
                role:
                    (session.data.identity.traits.role as Roles) ||
                    Roles.Regular,
                isLoggedIn: true,
            };
        })
        .catch(() => {
            return { role: Roles.Regular, isLoggedIn: false };
        });
};
