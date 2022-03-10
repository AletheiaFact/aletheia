import { Configuration, V0alpha2Api } from "@ory/client";

export const ory = new V0alpha2Api(
    new Configuration({
        basePath: `http://localhost:3000`,
        accessToken: process.env.ORY_ACCESS_TOKEN,
    })
);
