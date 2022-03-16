import { Configuration, V0alpha2Api } from "@ory/client";

export const ory = new V0alpha2Api(
    new Configuration({
        basePath: process.env.ORY_SDK_URL,
        accessToken: process.env.ORY_ACCESS_TOKEN,
    })
);
