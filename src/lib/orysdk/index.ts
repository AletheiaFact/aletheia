import {
    Configuration,
    FrontendApi,
    IdentityApi,
    OAuth2Api,
} from "@ory/client";
import { edgeConfig } from "@ory/integrations/next";

export const ory = {
    identity: new IdentityApi(new Configuration(edgeConfig)),
    frontend: new FrontendApi(new Configuration(edgeConfig)),
    oauth2: new OAuth2Api(new Configuration(edgeConfig)),
};
