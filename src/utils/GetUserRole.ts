import { useAtom } from "jotai";
import { ory } from "../lib/orysdk";
import { Roles } from "../types/enums";
import { currentNameSpace } from "../atoms/namespace";

export const GetUserRole = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    return ory.frontend
        .toSession()
        .then((session) => {
            return {
                role:
                    (session.data.identity.traits.role[nameSpace] as Roles) ||
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
