// @ory/integrations offers a package for integrating with NextJS.
import { config, createApiHandler } from "@ory/integrations/next-edge";

// And create the Ory Cloud API "bridge".
export default createApiHandler({
    fallbackToPlayground: false,
});
