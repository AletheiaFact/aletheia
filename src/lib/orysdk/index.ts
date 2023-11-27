import {
    Configuration,
    FrontendApi,
    IdentityApi,
    OAuth2Api,
} from "@ory/client";
import { edgeConfig } from "@ory/integrations/next";

let oryConfig = new Configuration(edgeConfig);

if (process.env.ENVIRONMENT !== "production") {
    oryConfig = new Configuration({
        basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL,
        baseOptions: {
            withCredentials: false,
        },
    });
}

export const ory = {
    identity: new IdentityApi(oryConfig),
    frontend: new FrontendApi(oryConfig),
};
