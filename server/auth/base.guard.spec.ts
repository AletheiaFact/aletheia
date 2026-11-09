import { BaseGuard } from "./base.guard";

class TestGuard extends BaseGuard {
    canActivate() {
        return true;
    }

    allowed(url: string) {
        return this.isAllowedPublicUrl(url);
    }

    redirect(request: any, response: any, isPublic: boolean) {
        return this.checkAndRedirect(request, response, isPublic, "/login");
    }
}

const makeGuard = (overridePublicRoutes?: string) =>
    new TestGuard(
        {
            get: vi.fn((key: string) =>
                key === "override_public_routes"
                    ? overridePublicRoutes
                    : undefined
            ),
        } as any,
        {} as any
    );

describe("BaseGuard public URL allowlist", () => {
    it("allows both MCP OAuth discovery documents", () => {
        const guard = makeGuard();
        expect(
            guard.allowed("/.well-known/oauth-protected-resource/api/mcp")
        ).toBe(true);
        expect(guard.allowed("/.well-known/oauth-authorization-server")).toBe(
            true
        );
    });

    it("does not allow other pages", () => {
        expect(makeGuard().allowed("/claim/abc/debate")).toBe(false);
    });
});

describe("BaseGuard.checkAndRedirect with override_public_routes", () => {
    const run = (url: string) => {
        const response = { redirect: vi.fn() };
        const result = makeGuard("true").redirect({ url }, response, true);
        return { result, redirect: response.redirect };
    };

    it("serves the authorization server metadata without a redirect", () => {
        const { result, redirect } = run(
            "/.well-known/oauth-authorization-server"
        );
        expect(result).toBe(true);
        expect(redirect).not.toHaveBeenCalled();
    });

    it("serves the protected resource metadata without a redirect", () => {
        const { result, redirect } = run(
            "/.well-known/oauth-protected-resource/api/mcp"
        );
        expect(result).toBe(true);
        expect(redirect).not.toHaveBeenCalled();
    });

    it("still redirects a public page that is not on the allowlist", () => {
        const { result, redirect } = run("/claim/abc/debate");
        expect(result).toBe(false);
        expect(redirect).toHaveBeenCalledWith("/login");
    });
});
