import { ory } from "../../lib/orysdk";

export async function CreateLogoutHandler() {
    const { data } = await ory.frontend.createBrowserLogoutFlow();
    await ory.frontend.updateLogoutFlow({ token: data.logout_token });
}
