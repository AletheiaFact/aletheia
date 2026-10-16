import { HEADERS_METADATA } from "@nestjs/common/constants";
import fg from "fast-glob";
import path from "path";

/**
 * Cloudflare does not store a response that carries "Cache-Control: private".
 * That header is what keeps a guarded response out of the shared cache, even
 * when a broad Cloudflare Cache Rule matches its path. This test holds the
 * convention in place. See CACHING.md.
 */
describe("Cache-Control convention (Unit)", () => {
    type Endpoint = {
        file: string;
        controller: string;
        handler: string;
        cacheControl: string;
        isPublic: boolean;
    };

    async function collectEndpoints(): Promise<Endpoint[]> {
        const files = await fg("server/**/*.controller.ts", {
            ignore: ["**/dist/**", "**/node_modules/**"],
        });
        const endpoints: Endpoint[] = [];

        for (const file of files) {
            const moduleExports = await import(path.resolve(file));

            for (const exported of Object.values(moduleExports)) {
                if (typeof exported !== "function" || !exported.prototype) {
                    continue;
                }
                const controller: any = exported;
                const classIsPublic =
                    Reflect.getMetadata("public", controller) === true;

                for (const handlerName of Object.getOwnPropertyNames(
                    controller.prototype
                )) {
                    if (handlerName === "constructor") {
                        continue;
                    }
                    const handler = controller.prototype[handlerName];
                    if (typeof handler !== "function") {
                        continue;
                    }
                    const headers: Array<{ name: string; value: string }> =
                        Reflect.getMetadata(HEADERS_METADATA, handler) || [];
                    const cacheControl = headers.find(
                        (header) =>
                            header.name.toLowerCase() === "cache-control"
                    );
                    if (!cacheControl) {
                        continue;
                    }
                    endpoints.push({
                        file,
                        controller: controller.name,
                        handler: handlerName,
                        cacheControl: cacheControl.value,
                        isPublic:
                            classIsPublic ||
                            Reflect.getMetadata("public", handler) === true,
                    });
                }
            }
        }
        return endpoints;
    }

    let endpoints: Endpoint[];

    beforeAll(async () => {
        endpoints = await collectEndpoints();
    });

    it("finds the endpoints that set Cache-Control", () => {
        expect(endpoints.length).toBeGreaterThan(40);
    });

    it("marks every guarded endpoint as private", () => {
        const leaks = endpoints
            .filter((endpoint) => !endpoint.isPublic)
            .filter((endpoint) => !endpoint.cacheControl.startsWith("private"))
            .map(
                (endpoint) =>
                    `${endpoint.controller}.${endpoint.handler} -> "${endpoint.cacheControl}" (${endpoint.file})`
            );

        expect(leaks).toEqual([]);
    });

    it("keeps every public endpoint out of the private cache", () => {
        const mislabelled = endpoints
            .filter((endpoint) => endpoint.isPublic)
            .filter((endpoint) => endpoint.cacheControl.startsWith("private"))
            .map(
                (endpoint) =>
                    `${endpoint.controller}.${endpoint.handler} -> "${endpoint.cacheControl}" (${endpoint.file})`
            );

        expect(mislabelled).toEqual([]);
    });
});
