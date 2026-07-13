import { useAtom } from "jotai";
import { ory } from "../lib/orysdk";
import { Roles } from "../types/enums";
import { currentNameSpace } from "../atoms/namespace";

export const GetUserRole = () => {
    const [nameSpace] = useAtom(currentNameSpace);

    return async () => {
        try {
            const { data } = await ory.frontend.toSession();

            return {
                role:
                    (data.identity.traits.role?.[nameSpace] as Roles) ??
                    Roles.Regular,
                isLoggedIn: true,
                aal: data.authenticator_assurance_level,
                id: data.identity.traits.user_id,
                status: data.identity.state,
            };
        } catch {
            return {
                role: Roles.Regular,
                isLoggedIn: false,
                id: "",
                aal: "",
            };
        }
    };
};
