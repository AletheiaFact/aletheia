import { Configuration, FrontendApi, IdentityApi } from "@ory/client";
import { edgeConfig } from "@ory/integrations/next";

let oryConfig = new Configuration(edgeConfig);

    oryConfig = new Configuration({
        basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL,
        baseOptions: {
            withCredentials: true,
        },
    });
}

export const ory = {
    identity: new IdentityApi(oryConfig),
    frontend: new FrontendApi(oryConfig),
};
