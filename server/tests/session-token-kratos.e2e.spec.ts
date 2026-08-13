import { Reflector } from "@nestjs/core";
import { SessionGuard } from "../auth/session.guard";
import { TokenIdentityService } from "../auth/token-identity.service";
import type OryService from "../auth/ory/ory.service";
import type { UsersService } from "../users/users.service";
import type { ConfigService } from "@nestjs/config";
import type { ExecutionContext } from "@nestjs/common";

/**
 * SessionGuard ⇄ real Ory Kratos integration test.
 *
 * Unlike the other e2e suites (which replace SessionGuard with a mock), this
 * suite drives the REAL guard against the REAL Kratos instance from
 * docker-compose. It proves the native/API-flow fix: a user who logs in
 * through Ory's API flow gets an `ory_st_…` session token (no browser cookie),
 * and the guard must authenticate that token when it arrives in the
 * `X-Session-Token` header — the exact path a native mobile app uses to call
 * `DELETE /api/me` for in-app account deletion.
 *
 * The suite self-skips when Kratos is not reachable (e.g. CI without the
 * docker-compose stack), so it never produces false failures. To run it:
 *   docker-compose up -d kratos mongodb   # then
 *   yarn test:e2e server/tests/session-token-kratos.e2e.spec.ts
 */

const KRATOS_PUBLIC_URL =
    process.env.ORY_SDK_URL?.replace(/\/$/, "") || "http://localhost:4433";
const KRATOS_ADMIN_URL =
    process.env.ORY_ADMIN_URL?.replace(/\/$/, "") || "http://localhost:4434";
const APP_AFFILIATION = "aletheia";
// Kratos password policy: long enough and not on the breached-password list.
const TEST_PASSWORD = "Str0ngP@ssw0rd!2026xz";

// Probe Kratos once at load time so the whole suite can skip cleanly when the
// docker-compose stack is not running. Top-level await is supported by the
// Vitest ESM transform.
const kratosReady = await fetch(`${KRATOS_PUBLIC_URL}/health/ready`)
    .then((r) => r.ok)
    .catch(() => false);

if (!kratosReady) {
    // eslint-disable-next-line no-console
    console.warn(
        `[session-token-kratos.e2e] Kratos not reachable at ${KRATOS_PUBLIC_URL} — skipping real-Kratos integration suite.`
    );
}

interface CreatedIdentity {
    identityId: string;
    email: string;
    userId: string;
    sessionToken: string;
}

/** Create an identity (with a password) via the Kratos Admin API. */
async function createIdentity(userId: string, email: string): Promise<string> {
    const res = await fetch(`${KRATOS_ADMIN_URL}/admin/identities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            schema_id: "default",
            traits: {
                email,
                user_id: userId,
                role: { main: "regular" },
                app_affiliation: APP_AFFILIATION,
            },
            credentials: {
                password: { config: { password: TEST_PASSWORD } },
            },
        }),
    });
    if (!res.ok) {
        throw new Error(
            `Failed to create identity (${res.status}): ${await res.text()}`
        );
    }
    return (await res.json()).id;
}

/** Log in through Ory's native/API flow and return the `ory_st_…` token. */
async function nativeLogin(email: string): Promise<string> {
    const flow = await fetch(
        `${KRATOS_PUBLIC_URL}/self-service/login/api`
    ).then((r) => r.json());

    const res = await fetch(
        `${KRATOS_PUBLIC_URL}/self-service/login?flow=${flow.id}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                method: "password",
                identifier: email,
                password: TEST_PASSWORD,
            }),
        }
    );
    const data = await res.json();
    if (!data.session_token) {
        throw new Error(
            `Native login did not return a session token: ${JSON.stringify(
                data
            ).slice(0, 300)}`
        );
    }
    return data.session_token;
}

async function deleteIdentity(identityId: string): Promise<void> {
    await fetch(`${KRATOS_ADMIN_URL}/admin/identities/${identityId}`, {
        method: "DELETE",
    });
}

/** Build a minimal ExecutionContext carrying the given headers + url. */
function buildContext(
    headers: { cookie?: string; sessionToken?: string },
    url = "/api/me"
) {
    const request: any = {
        header: (name: string) => {
            if (name === "X-Session-Token") return headers.sessionToken;
            if (name === "Cookie") return headers.cookie;
            return undefined;
        },
        url,
        params: {},
    };
    const response = { redirect: vi.fn() };
    const context = {
        getHandler: () => vi.fn(),
        getClass: () => vi.fn(),
        switchToHttp: () => ({
            getRequest: () => request,
            getResponse: () => response,
        }),
    } as unknown as ExecutionContext;
    return { context, request, response };
}

describe.skipIf(!kratosReady)("SessionGuard ⇄ real Kratos (native token)", () => {
    let guard: SessionGuard;
    let getById: ReturnType<typeof vi.fn>;
    let identity: CreatedIdentity;

    const configValues: Record<string, unknown> = {
        authentication_type: "ory",
        "ory.url": KRATOS_PUBLIC_URL,
        "ory.access_token": "",
        app_affiliation: APP_AFFILIATION,
        override_public_routes: undefined,
    };

    const configService = {
        get: (key: string) => configValues[key],
    } as unknown as ConfigService;

    beforeAll(async () => {
        const stamp = `${process.env.VITEST_WORKER_ID || "1"}-${Date.now()}`;
        const email = `delete-test-${stamp}@aletheia.test`;
        const userId = `mongo-user-${stamp}`;
        const identityId = await createIdentity(userId, email);
        const sessionToken = await nativeLogin(email);
        identity = { identityId, email, userId, sessionToken };

        // The guard resolves the Mongo user from the token's `user_id` trait.
        // A native token is a real user session, so this lookup succeeds.
        getById = vi.fn().mockResolvedValue({ _id: userId });
        const usersService = { getById } as unknown as UsersService;

        const tokenIdentity = new TokenIdentityService(
            configService,
            {} as unknown as OryService // unused on the session-token path
        );
        const reflector = {
            get: () => false, // no @Public() metadata
        } as unknown as Reflector;

        guard = new SessionGuard(
            configService,
            reflector,
            usersService,
            tokenIdentity
        );
    });

    afterAll(async () => {
        if (identity?.identityId) {
            await deleteIdentity(identity.identityId);
        }
    });

    it("authenticates a native session token sent via X-Session-Token", async () => {
        const { context, request } = buildContext({
            sessionToken: identity.sessionToken,
        });

        const result = await guard.canActivate(context);

        expect(result).toBe(true);
        expect(getById).toHaveBeenCalledWith(identity.userId);
        expect(request.user).toEqual(
            expect.objectContaining({
                isM2M: false,
                _id: identity.userId,
                id: identity.userId,
            })
        );
    });

    it("does not populate request.user when no cookie and no token are sent", async () => {
        const { context, request } = buildContext({});

        await guard.canActivate(context);

        // Kratos rejects the empty credentials, so the guard cannot resolve an
        // identity. (For /api/* routes the guard still returns true by design,
        // but the request stays unauthenticated — request.user is never set.)
        expect(request.user).toBeUndefined();
    });

    it("rejects a malformed/invalid session token", async () => {
        const { context, request } = buildContext({
            sessionToken: "ory_st_this-is-not-a-real-token",
        });

        await guard.canActivate(context);

        expect(request.user).toBeUndefined();
    });
});
