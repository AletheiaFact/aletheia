// @ory/integrations offers a package for integrating with NextJS.
import { nextjs } from "@ory/integrations";

export const config = nextjs.config;

// we need it to create the Ory Cloud API "bridge".
export default nextjs.createApiHandler({
    fallbackToPlayground: false,
});
