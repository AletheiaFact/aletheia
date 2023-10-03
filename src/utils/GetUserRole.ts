import { ory } from "../lib/orysdk";
import { Roles } from "../types/enums";

export const GetUserRole = () => {
    return ory.frontend
        .toSession()
        .then((session) => {
            return {
                role:
                    (session.data.identity.traits.role as Roles) ||
                    Roles.Regular,
                isLoggedIn: true,
                aal: session.data.authenticator_assurance_level,
                id: session.data.identity.traits.user_id,
                status: session?.data.identity.state,
            };
        })
        .catch(() => {
            return { role: Roles.Regular, isLoggedIn: false, id: "", aal: "" };
        });
};
