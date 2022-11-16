import { ory } from "../lib/orysdk";
import { Roles } from "../types/enums";

export const GetUserRole = () => {
    return ory
        .toSession()
        .then((session) => {
            return (
                (session.data.identity.traits.role as Roles) || Roles.Regular
            );
        })
        .catch(() => {
            return Roles.Regular;
        });
};
