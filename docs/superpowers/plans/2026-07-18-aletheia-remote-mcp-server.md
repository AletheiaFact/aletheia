# Aletheia Remote MCP Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose Aletheia as a remote MCP server at `POST /server/mcp` with OAuth 2.1 bearer auth (Ory Hydra/Network), so MCP clients (claude.ai, Claude Code, Cursor) can log in as real users and run read/search, fact-checking-workflow, and content-creation tools.

**Architecture:** New `server/mcp/` NestJS module inside the existing monolith. A request-scoped `McpService` builds a fresh `McpServer` (from `@modelcontextprotocol/sdk`) per HTTP request (stateless Streamable HTTP transport, JSON responses) and registers tools that call existing domain services directly. A new `McpAuthGuard` introspects bearer tokens via Hydra and resolves user tokens to real Kratos identities (real role), fixing the current behavior where every bearer token gets the limited `integration` role.

**Tech Stack:** NestJS 9/10 (Express), `@modelcontextprotocol/sdk` (new dep), `@ory/client` 1.6.2, Zod, Vitest (+supertest, mongodb-memory-server), Yarn 3.6.3.

**Spec:** `docs/superpowers/specs/2026-07-18-aletheia-remote-mcp-server-design.md`

---

## Context primer (read first)

- Run everything from repo root. Type check: `yarn build-ts`. Unit tests: `yarn env-cmd --silent vitest run --project unit <file>`. E2E: `yarn env-cmd --silent vitest run --project e2e <file>`. Vitest globals mode is ON (`vi`, `describe`, `expect` are global).
- Config is a YAML file loaded by `server/configLoader.ts` and passed into `AppModule.register(options)` (`server/app.module.ts:80`); `configService.get("x.y")` reads nested keys.
- Global guards (via `APP_GUARD`, `server/app.module.ts:163-188`): `ThrottlerGuard` → `SessionOrM2MGuard` → `NameSpaceGuard`. `SessionOrM2MGuard` tries `M2MGuard` first, then `SessionGuard`. `BaseGuard.checkAndRedirect` (`server/auth/base.guard.ts:35-66`) has a hardcoded `publicUrls` allow-list; URLs starting with `/api` always pass.
- Vitest 4 constructor mocks must use `function () {}` not arrow functions (see comment in `server/auth/m2m.guard.spec.ts:8-11`), and mock fns used inside `vi.mock` factories must be created with `vi.hoisted`.
- Most domain services are `Scope.REQUEST` and read `req.user` for history attribution — our MCP controller chain is request-scoped too, so normal constructor injection works.
- Project convention: **new validation code uses Zod** (`z.infer`), even though legacy DTOs use class-validator.

## File structure

```
server/mcp/
├── mcp.module.ts               # Nest module; imports domain modules
├── mcp.controller.ts           # POST/GET/DELETE /server/mcp (Streamable HTTP)
├── mcp-well-known.controller.ts# GET /.well-known/oauth-protected-resource/server/mcp
├── mcp-auth.guard.ts           # Bearer introspection + identity resolution (+spec)
├── mcp.service.ts              # Request-scoped; builds McpServer, wires deps
└── tools/
    ├── tool-helpers.ts         # result/error helpers shared by tools
    ├── schemas.ts              # Zod input schemas for every tool
    ├── read-tools.ts           # 12 read/search tools
    └── write-tools.ts          # 5 write tools
Modified: server/auth/ory/ory.service.ts (+getIdentity), server/auth/base.guard.ts
          (publicUrls), server/app.module.ts (conditional McpModule),
          config.example.yaml, deployment/config/config-file/modules/service/confBase.pkl
Tests:    server/mcp/mcp-auth.guard.spec.ts, server/auth/ory/ory.service.spec.ts,
          server/tests/mcp.e2e.spec.ts
Docs:     server/mcp/README.md
```

---

### Task 1: Branch + dependencies

**Files:** Modify: `package.json`

- [ ] **Step 1: Create the work branch off `stage`**

```bash
git stash --include-untracked --message "pre-mcp WIP"   # only if the tree is dirty with unrelated work
git checkout stage && git pull
git checkout -b feat/remote-mcp-server
```

- [ ] **Step 2: Add the MCP SDK and align Zod**

The MCP SDK depends on `zod@^3.23.x`; the repo has `^3.21.4`. Two zod instances break the SDK's schema handling, so bump the root dep (minor-version bump within v3, backward compatible).

```bash
yarn add @modelcontextprotocol/sdk
yarn add zod@^3.23.8
```

- [ ] **Step 3: Verify nothing broke**

Run: `yarn build-ts` → expect exit 0. Run: `yarn test:unit` → expect same pass/fail set as before the change (run it on `stage` first if unsure).

- [ ] **Step 4: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore(mcp): add @modelcontextprotocol/sdk, align zod version"
```

---

### Task 2: `OryService.getIdentity`

**Files:**
- Modify: `server/auth/ory/ory.service.ts`
- Test: `server/auth/ory/ory.service.spec.ts` (new)

- [ ] **Step 1: Write the failing test**

`OryService` builds `this.adminUrl = \`${admin_url}/${admin_endpoint}\`` from `configService.get("ory")` in its constructor and uses raw `fetch` (see `ory.service.ts:12-17`). Mock global fetch.

```typescript
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { OryService } from "./ory.service";

describe("OryService.getIdentity", () => {
    const fetchMock = vi.fn();
    let oryService: OryService;

    beforeEach(async () => {
        vi.stubGlobal("fetch", fetchMock);
        fetchMock.mockReset();
        const module = await Test.createTestingModule({
            providers: [
                OryService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: vi.fn((key: string) =>
                            key === "ory"
                                ? {
                                      url: "http://ory",
                                      admin_url: "http://ory-admin",
                                      admin_endpoint: "admin",
                                      access_token: "test-token",
                                  }
                                : "aletheia"
                        ),
                    },
                },
            ],
        }).compile();
        oryService = await module.resolve(OryService);
    });

    afterEach(() => vi.unstubAllGlobals());

    it("fetches an identity by id from the Kratos admin API", async () => {
        const identity = {
            id: "identity-1",
            state: "active",
            traits: { user_id: "u1", role: { main: "admin" } },
        };
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => identity,
        });

        const result = await oryService.getIdentity("identity-1");

        expect(fetchMock).toHaveBeenCalledWith(
            "http://ory-admin/admin/identities/identity-1",
            expect.objectContaining({
                method: "get",
                headers: expect.objectContaining({
                    Authorization: "Bearer test-token",
                }),
            })
        );
        expect(result).toEqual(identity);
    });

    it("throws when the admin API responds non-2xx", async () => {
        fetchMock.mockResolvedValue({ ok: false, status: 404 });
        await expect(oryService.getIdentity("missing")).rejects.toThrow(
            /Failed to fetch identity/
        );
    });
});
```

Note: use `module.resolve(...)` (not `get`) if `OryService` turns out to be request-scoped; with plain `@Injectable()` both work.

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn env-cmd --silent vitest run --project unit server/auth/ory/ory.service.spec.ts`
Expected: FAIL — `oryService.getIdentity is not a function`

- [ ] **Step 3: Implement `getIdentity`**

Add to `server/auth/ory/ory.service.ts`, following the existing raw-fetch style of `whoAmI`/`updateIdentity`:

```typescript
    async getIdentity(id: string): Promise<any> {
        const { access_token: token } = this.configService.get("ory");
        const response = await fetch(`${this.adminUrl}/identities/${id}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(
                `Failed to fetch identity ${id}: ${response.status}`
            );
        }
        return response.json();
    }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn env-cmd --silent vitest run --project unit server/auth/ory/ory.service.spec.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add server/auth/ory/ory.service.ts server/auth/ory/ory.service.spec.ts
git commit -m "feat(auth): add OryService.getIdentity for admin identity lookup"
```

---

### Task 3: `McpAuthGuard`

**Files:**
- Create: `server/mcp/mcp-auth.guard.ts`
- Test: `server/mcp/mcp-auth.guard.spec.ts`

- [ ] **Step 1: Write the failing tests**

Model the `@ory/client` mock on `server/auth/m2m.guard.spec.ts` (hoisted mock fn, `function`-style constructor mocks).

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { McpAuthGuard } from "./mcp-auth.guard";
import { OryService } from "../auth/ory/ory.service";

const mockIntrospect = vi.hoisted(() => vi.fn());

vi.mock("@ory/client", () => ({
    Configuration: vi.fn().mockImplementation(function () {
        return {};
    }),
    OAuth2Api: vi.fn().mockImplementation(function () {
        return { introspectOAuth2Token: mockIntrospect };
    }),
}));

const configValues: Record<string, any> = {
    "ory.hydra.url": "http://hydra",
    "ory.url": "http://ory",
    "ory.access_token": "ory-admin-token",
    app_affiliation: "aletheia",
    "mcp.public_url": "https://aletheiafact.org",
};

const mockGetIdentity = vi.fn();

function createMockContext(authorization?: string) {
    const request: any = { headers: {} };
    if (authorization) request.headers.authorization = authorization;
    const response: any = { setHeader: vi.fn() };
    const context = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: () => ({
            getRequest: () => request,
            getResponse: () => response,
        }),
    } as unknown as ExecutionContext;
    return { context, request, response };
}

describe("McpAuthGuard", () => {
    let guard: McpAuthGuard;

    beforeEach(async () => {
        vi.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                McpAuthGuard,
                {
                    provide: ConfigService,
                    useValue: { get: vi.fn((k: string) => configValues[k]) },
                },
                Reflector,
                {
                    provide: OryService,
                    useValue: { getIdentity: mockGetIdentity },
                },
            ],
        }).compile();
        guard = module.get(McpAuthGuard);
    });

    it("rejects requests without a bearer token with a WWW-Authenticate challenge", async () => {
        const { context, response } = createMockContext();
        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
        expect(response.setHeader).toHaveBeenCalledWith(
            "WWW-Authenticate",
            'Bearer resource_metadata="https://aletheiafact.org/.well-known/oauth-protected-resource/server/mcp"'
        );
    });

    it("rejects inactive tokens", async () => {
        mockIntrospect.mockResolvedValue({ data: { active: false } });
        const { context } = createMockContext("Bearer expired");
        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
    });

    it("keeps integration role for machine tokens (sub === client_id)", async () => {
        mockIntrospect.mockResolvedValue({
            data: {
                active: true,
                client_id: "client-1",
                sub: "client-1",
                scope: "read write",
            },
        });
        const { context, request } = createMockContext("Bearer m2m-token");
        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(request.user.isM2M).toBe(true);
        expect(request.user.role).toEqual({ main: "integration" });
        expect(mockGetIdentity).not.toHaveBeenCalled();
    });

    it("resolves user tokens to the real Kratos identity and role", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp-client", sub: "identity-9" },
        });
        mockGetIdentity.mockResolvedValue({
            id: "identity-9",
            state: "active",
            traits: {
                user_id: "62585756d665dc7bf4b14aa3",
                role: { main: "admin" },
                app_affiliation: "aletheia",
            },
        });
        const { context, request } = createMockContext("Bearer user-token-a");
        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(mockGetIdentity).toHaveBeenCalledWith("identity-9");
        expect(request.user).toEqual({
            isM2M: false,
            _id: "62585756d665dc7bf4b14aa3",
            id: "62585756d665dc7bf4b14aa3",
            role: { main: "admin" },
            status: "active",
        });
    });

    it("rejects identities with a mismatched app affiliation", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp-client", sub: "identity-2" },
        });
        mockGetIdentity.mockResolvedValue({
            id: "identity-2",
            state: "active",
            traits: {
                user_id: "u2",
                role: { main: "admin" },
                app_affiliation: "other-app",
            },
        });
        const { context } = createMockContext("Bearer user-token-b");
        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
    });

    it("caches successful introspections per token", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp-client", sub: "identity-9" },
        });
        mockGetIdentity.mockResolvedValue({
            id: "identity-9",
            state: "active",
            traits: {
                user_id: "u9",
                role: { main: "fact-checker" },
                app_affiliation: "aletheia",
            },
        });
        const first = createMockContext("Bearer user-token-c");
        const second = createMockContext("Bearer user-token-c");
        await guard.canActivate(first.context);
        await guard.canActivate(second.context);
        expect(mockIntrospect).toHaveBeenCalledTimes(1);
        expect(second.request.user.role).toEqual({ main: "fact-checker" });
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn env-cmd --silent vitest run --project unit server/mcp/mcp-auth.guard.spec.ts`
Expected: FAIL — cannot resolve `./mcp-auth.guard`

- [ ] **Step 3: Implement the guard**

```typescript
import {
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Configuration, OAuth2Api } from "@ory/client";
import { BaseGuard } from "../auth/base.guard";
import { OryService } from "../auth/ory/ory.service";
import { toError } from "../util/error-handling";

interface CachedAuth {
    user: Record<string, any>;
    expiresAt: number;
}

/**
 * Bearer-token guard for the MCP endpoint.
 *
 * Unlike M2MGuard (which labels every active token as the `integration`
 * role), this guard distinguishes machine tokens (sub === client_id) from
 * user tokens obtained via the OAuth authorization-code flow, resolving the
 * latter to the real Kratos identity so CASL abilities apply the user's
 * actual role.
 */
@Injectable()
export class McpAuthGuard extends BaseGuard {
    protected readonly logger = new Logger(McpAuthGuard.name);
    private readonly cache = new Map<string, CachedAuth>();
    static readonly CACHE_TTL_MS = 60_000;

    constructor(
        protected configService: ConfigService,
        protected reflector: Reflector,
        private readonly oryService: OryService
    ) {
        super(configService, reflector);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();

        const token = this.extractBearerToken(
            request.headers["authorization"]
        );
        if (!token) {
            this.deny(response, "Missing bearer token");
        }

        const cached = this.cache.get(token);
        if (cached && cached.expiresAt > Date.now()) {
            request.user = cached.user;
            return true;
        }

        let introspection;
        try {
            const hydraConfig = new Configuration({
                basePath: this.configService.get<string>("ory.hydra.url"),
                accessToken:
                    this.configService.get<string>("ory.access_token"),
            });
            const hydraApi = new OAuth2Api(hydraConfig);
            ({ data: introspection } = await hydraApi.introspectOAuth2Token({
                token,
            }));
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `MCP token introspection failed: ${err.message}`,
                err.stack
            );
            this.deny(response, "Token introspection failed");
        }

        if (!introspection.active) {
            this.deny(response, "Inactive token");
        }

        const user = await this.resolveUser(introspection, response);
        this.cache.set(token, {
            user,
            expiresAt: Date.now() + McpAuthGuard.CACHE_TTL_MS,
        });
        request.user = user;
        return true;
    }

    private async resolveUser(
        introspection: Record<string, any>,
        response: any
    ): Promise<Record<string, any>> {
        const isM2M =
            introspection.client_id &&
            introspection.sub === introspection.client_id;
        if (isM2M) {
            return {
                isM2M: true,
                clientId: introspection.client_id,
                subject: introspection.sub,
                scopes: introspection.scope?.split(" "),
                role: { main: "integration" },
                namespace: "main",
            };
        }

        let identity;
        try {
            identity = await this.oryService.getIdentity(introspection.sub);
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `MCP identity lookup failed: ${err.message}`,
                err.stack
            );
            this.deny(response, "Identity lookup failed");
        }

        const traits = identity?.traits;
        const expectedAffiliation =
            this.configService.get<string>("app_affiliation");
        if (!traits || traits.app_affiliation !== expectedAffiliation) {
            this.deny(response, "Affiliation mismatch");
        }

        return {
            isM2M: false,
            _id: traits.user_id,
            id: traits.user_id,
            role: traits.role,
            status: identity.state,
        };
    }

    private deny(response: any, reason: string): never {
        const publicUrl = this.configService.get<string>("mcp.public_url");
        response.setHeader(
            "WWW-Authenticate",
            `Bearer resource_metadata="${publicUrl}/.well-known/oauth-protected-resource/server/mcp"`
        );
        throw new UnauthorizedException(reason);
    }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `yarn env-cmd --silent vitest run --project unit server/mcp/mcp-auth.guard.spec.ts`
Expected: PASS (6 tests). Also run `yarn build-ts` → exit 0.

- [ ] **Step 5: Commit**

```bash
git add server/mcp/mcp-auth.guard.ts server/mcp/mcp-auth.guard.spec.ts
git commit -m "feat(mcp): add McpAuthGuard resolving user bearer tokens to real roles"
```

---

### Task 4: Let MCP routes through the global guard chain

**Files:** Modify: `server/auth/base.guard.ts:41-51`

The global `SessionOrM2MGuard` runs before controller guards. For anonymous requests, `SessionGuard.checkAndRedirect` would redirect `/server/mcp` and `/.well-known/...` to `/login` (they don't start with `/api`), breaking the MCP 401 challenge. Add both prefixes to the hardcoded `publicUrls` list.

Note: for requests WITH a bearer token, the global `M2MGuard` will introspect and pass them with `role: integration`; that's harmless because `McpAuthGuard` (controller-level, runs after) overwrites `request.user` with the correctly resolved user.

- [ ] **Step 1: Add the URLs**

In `server/auth/base.guard.ts`, extend the `publicUrls` array (currently `/login`, `/unauthorized`, `/_next`, `/api/.ory`, `/api/health`, `/sign-up`, `/api/user/register`, `/api/claim`, `/signup-invite`):

```typescript
            "/server/mcp",
            "/.well-known/oauth-protected-resource",
```

- [ ] **Step 2: Verify existing guard tests still pass**

Run: `yarn env-cmd --silent vitest run --project unit server/auth`
Expected: PASS, same count as before.

- [ ] **Step 3: Commit**

```bash
git add server/auth/base.guard.ts
git commit -m "feat(mcp): allow MCP and well-known routes through session redirect logic"
```

---

### Task 5: Protected-resource metadata endpoint

**Files:**
- Create: `server/mcp/mcp-well-known.controller.ts`

- [ ] **Step 1: Create the controller**

```typescript
import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Public } from "../auth/decorators/auth.decorator";

/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728) for the MCP endpoint.
 * MCP clients discover the authorization server (Ory) from this document
 * after receiving a 401 challenge from /server/mcp.
 */
@Controller()
export class McpWellKnownController {
    constructor(private readonly configService: ConfigService) {}

    @Public()
    @Get(".well-known/oauth-protected-resource/server/mcp")
    getProtectedResourceMetadata() {
        const publicUrl = this.configService.get<string>("mcp.public_url");
        const authorizationServer =
            this.configService.get<string>("mcp.authorization_server") ||
            this.configService.get<string>("ory.url");
        return {
            resource: `${publicUrl}/server/mcp`,
            authorization_servers: [authorizationServer],
            bearer_methods_supported: ["header"],
        };
    }
}
```

(No unit test here — this is covered end-to-end in Task 8.)

- [ ] **Step 2: Type check**

Run: `yarn build-ts` → exit 0.

- [ ] **Step 3: Commit**

```bash
git add server/mcp/mcp-well-known.controller.ts
git commit -m "feat(mcp): serve RFC 9728 protected resource metadata"
```

---

### Task 6: MCP module, controller, service, and tools

**Files:**
- Create: `server/mcp/tools/tool-helpers.ts`
- Create: `server/mcp/tools/schemas.ts`
- Create: `server/mcp/tools/read-tools.ts`
- Create: `server/mcp/tools/write-tools.ts`
- Create: `server/mcp/mcp.service.ts`
- Create: `server/mcp/mcp.controller.ts`
- Create: `server/mcp/mcp.module.ts`
- Test (written FIRST): `server/tests/mcp.e2e.spec.ts`

- [ ] **Step 1: Write the failing e2e test (protocol handshake + tool listing + auth)**

Pattern copied from `server/tests/source.e2e.spec.ts` (config construction lines 71-77, guard overrides lines 82-92). `McpAuthGuard` is overridden with a mock that injects the seeded admin user; the Streamable HTTP transport requires the dual `Accept` header.

```typescript
import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../app.module";
import { SessionGuard } from "../auth/session.guard";
import { SessionGuardMock } from "./mocks/SessionGuardMock";
import { SessionOrM2MGuard } from "../auth/m2m-or-session.guard";
import { SessionOrM2MGuardMock } from "./mocks/SessionOrM2MGuardMock";
import { M2MGuard } from "../auth/m2m.guard";
import { M2MGuardMock } from "./mocks/M2MGuardMock";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { AbilitiesGuardMock } from "./mocks/AbilitiesGuardMock";
import { HistoryService } from "../history/history.service";
import { HistoryServiceMock } from "./mocks/HistoryServiceMock";
import { McpAuthGuard } from "../mcp/mcp-auth.guard";
import { TestConfigOptions } from "./utils/TestConfigOptions";
import { SeedTestUser } from "./utils/SeedTestUser";
import { AdminUserMock } from "./utils/AdminUserMock";

const MCP_ACCEPT = "application/json, text/event-stream";

const McpAuthGuardMock = {
    canActivate: (context: any) => {
        const request = context.switchToHttp().getRequest();
        request.user = {
            isM2M: false,
            _id: AdminUserMock._id.toString(),
            id: AdminUserMock._id.toString(),
            role: { main: "admin" },
            status: "active",
        };
        return true;
    },
};

function rpc(method: string, params: any = {}, id = 1) {
    return { jsonrpc: "2.0", id, method, params };
}

async function callTool(app: any, name: string, args: any = {}) {
    const res = await request(app.getHttpServer())
        .post("/server/mcp")
        .set("Accept", MCP_ACCEPT)
        .send(rpc("tools/call", { name, arguments: args }))
        .expect(200);
    return res.body;
}

describe("MCP server (e2e)", () => {
    let app: any;

    beforeAll(async () => {
        const mongoUri = process.env.MONGO_URI!;
        await SeedTestUser(mongoUri);

        const testConfig = {
            ...TestConfigOptions.config,
            db: {
                ...TestConfigOptions.config.db,
                connection_uri: mongoUri,
            },
            mcp: {
                enabled: true,
                public_url: "http://localhost:3000",
            },
        };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule.register(testConfig)],
        })
            .overrideGuard(SessionGuard)
            .useValue(SessionGuardMock)
            .overrideGuard(SessionOrM2MGuard)
            .useValue(SessionOrM2MGuardMock)
            .overrideGuard(M2MGuard)
            .useValue(M2MGuardMock)
            .overrideGuard(AbilitiesGuard)
            .useValue(AbilitiesGuardMock)
            .overrideGuard(McpAuthGuard)
            .useValue(McpAuthGuardMock)
            .overrideProvider(HistoryService)
            .useValue(HistoryServiceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                whitelist: true,
                forbidNonWhitelisted: true,
            })
        );
        await app.init();
    });

    afterAll(async () => {
        await app?.close();
    });

    it("serves protected resource metadata", async () => {
        const res = await request(app.getHttpServer())
            .get("/.well-known/oauth-protected-resource/server/mcp")
            .expect(200);
        expect(res.body.resource).toBe("http://localhost:3000/server/mcp");
        expect(res.body.authorization_servers).toHaveLength(1);
    });

    it("answers the MCP initialize handshake", async () => {
        const res = await request(app.getHttpServer())
            .post("/server/mcp")
            .set("Accept", MCP_ACCEPT)
            .send(
                rpc("initialize", {
                    protocolVersion: "2025-03-26",
                    capabilities: {},
                    clientInfo: { name: "e2e", version: "1.0.0" },
                })
            )
            .expect(200);
        expect(res.body.result.serverInfo.name).toBe("aletheia");
    });

    it("rejects GET with 405 (stateless transport)", async () => {
        await request(app.getHttpServer())
            .get("/server/mcp")
            .set("Accept", MCP_ACCEPT)
            .expect(405);
    });

    it("lists all v1 tools", async () => {
        const res = await request(app.getHttpServer())
            .post("/server/mcp")
            .set("Accept", MCP_ACCEPT)
            .send(rpc("tools/list"))
            .expect(200);
        const names = res.body.result.tools.map((t: any) => t.name).sort();
        expect(names).toEqual(
            [
                "add_review_comment",
                "create_claim",
                "create_personality",
                "create_source",
                "create_verification_request",
                "get_claim",
                "get_claim_review",
                "get_personality",
                "get_review_task",
                "get_verification_request",
                "list_claims",
                "list_personalities",
                "list_review_tasks",
                "list_sources",
                "list_verification_requests",
                "search",
                "search_topics",
            ].sort()
        );
    });

    it("calls list_claims and returns a JSON payload", async () => {
        const body = await callTool(app, "list_claims", {
            page: 0,
            pageSize: 5,
        });
        expect(body.result.isError).toBeFalsy();
        const payload = JSON.parse(body.result.content[0].text);
        expect(payload).toHaveProperty("totalClaims");
        expect(payload).toHaveProperty("claims");
    });
});
```

- [ ] **Step 2: Run the e2e test to verify it fails**

Run: `yarn env-cmd --silent vitest run --project e2e server/tests/mcp.e2e.spec.ts`
Expected: FAIL — cannot resolve `../mcp/mcp-auth.guard` (module doesn't exist yet in app wiring; later failures will be 404s until Task 7 wires the module).

- [ ] **Step 3: Create `server/mcp/tools/tool-helpers.ts`**

```typescript
import { Logger } from "@nestjs/common";

const logger = new Logger("McpTools");

export interface ToolResult {
    [key: string]: unknown;
    content: { type: "text"; text: string }[];
    isError?: boolean;
}

export function jsonResult(data: unknown): ToolResult {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}

/** Wraps a tool handler so failures become readable MCP errors, not crashes. */
export function safeTool<Args>(
    name: string,
    handler: (args: Args) => Promise<ToolResult>
): (args: Args) => Promise<ToolResult> {
    return async (args: Args) => {
        try {
            return await handler(args);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            logger.error(`Tool ${name} failed: ${message}`);
            return {
                isError: true,
                content: [{ type: "text", text: `${name} failed: ${message}` }],
            };
        }
    };
}
```

- [ ] **Step 4: Create `server/mcp/tools/schemas.ts`**

```typescript
import { z } from "zod";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import { ReviewTaskTypeEnum } from "../../types/enums";

const pagination = {
    page: z.number().int().min(0).default(0),
    pageSize: z.number().int().min(1).max(50).default(10),
    order: z.enum(["asc", "desc"]).default("desc"),
};

const nameSpace = z.string().default(NameSpaceEnum.Main);

export const SearchSchema = z.object({
    searchText: z.string().min(1).describe("Free-text search query"),
    pageSize: pagination.pageSize,
    language: z.string().default("pt").describe("Result language (pt or en)"),
    nameSpace,
});

export const ListClaimsSchema = z.object({
    ...pagination,
    personalityId: z
        .string()
        .optional()
        .describe("Filter claims by personality id"),
    nameSpace,
});

export const GetClaimSchema = z.object({
    claimId: z.string().describe("Claim Mongo ObjectId"),
    nameSpace,
});

export const ListPersonalitiesSchema = z.object({
    ...pagination,
    language: z.string().default("pt"),
    nameSpace,
});

export const GetPersonalitySchema = z.object({
    personalityId: z.string().describe("Personality Mongo ObjectId"),
    language: z.string().default("pt"),
    nameSpace,
});

export const GetClaimReviewSchema = z
    .object({
        claimReviewId: z.string().optional(),
        dataHash: z
            .string()
            .optional()
            .describe("The review's data_hash (sentence/content hash)"),
    })
    .refine((value) => value.claimReviewId || value.dataHash, {
        message: "Provide claimReviewId or dataHash",
    });

export const ListReviewTasksSchema = z.object({
    ...pagination,
    value: z
        .string()
        .default("")
        .describe(
            "Workflow state filter, e.g. unassigned, assigned, reported, published"
        ),
    reviewTaskType: z.nativeEnum(ReviewTaskTypeEnum),
    nameSpace,
});

export const GetReviewTaskSchema = z.object({
    reviewTaskId: z.string().describe("Review task Mongo ObjectId"),
});

export const ListVerificationRequestsSchema = z.object({
    ...pagination,
    topics: z.array(z.string()).optional(),
    status: z.string().optional(),
});

export const GetVerificationRequestSchema = z.object({
    verificationRequestId: z.string(),
});

export const SearchTopicsSchema = z.object({
    query: z.string().min(1),
    language: z.string().default("pt"),
});

export const ListSourcesSchema = z.object({
    ...pagination,
    nameSpace,
});

export const CreateVerificationRequestSchema = z.object({
    content: z.string().min(10).describe("The content to be verified"),
    sourceChannel: z.string().default("mcp"),
    source: z
        .array(z.object({ href: z.string().url() }))
        .optional()
        .describe("URLs where the content circulates"),
    publicationDate: z.string().optional(),
    heardFrom: z.string().optional(),
    nameSpace,
});

export const AddReviewCommentSchema = z.object({
    dataHash: z.string().describe("The review task's data_hash"),
    comment: z.string().min(1).describe("Comment rich-text/plain content"),
    text: z.string().min(1).describe("Plain-text version of the comment"),
});

export const CreateClaimSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10).describe("The speech/claim text"),
    date: z.string().describe("ISO date the claim was made"),
    personalityId: z
        .string()
        .describe("Personality (author) Mongo ObjectId"),
    sources: z.array(z.string().url()).min(1),
    nameSpace,
});

export const CreatePersonalitySchema = z.object({
    name: z.string().min(2),
    description: z.string(),
    wikidata: z.string().describe("Wikidata entity id, e.g. Q123"),
});

export const CreateSourceSchema = z.object({
    href: z.string().url(),
    targetId: z.string().optional().describe("Claim/target ObjectId"),
    nameSpace,
});
```

- [ ] **Step 5: Create `server/mcp/tools/read-tools.ts`**

`McpToolDeps` is defined in `mcp.service.ts` (Step 7) — it carries the injected domain services plus the raw request.

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import mongoose from "mongoose";
import { jsonResult, safeTool } from "./tool-helpers";
import {
    GetClaimReviewSchema,
    GetClaimSchema,
    GetPersonalitySchema,
    GetReviewTaskSchema,
    GetVerificationRequestSchema,
    ListClaimsSchema,
    ListPersonalitiesSchema,
    ListReviewTasksSchema,
    ListSourcesSchema,
    ListVerificationRequestsSchema,
    SearchSchema,
    SearchTopicsSchema,
} from "./schemas";
import type { McpToolDeps } from "../mcp.service";

export function registerReadTools(server: McpServer, deps: McpToolDeps) {
    server.registerTool(
        "search",
        {
            description:
                "Full-text search across personalities, claim sentences and claim revisions",
            inputSchema: SearchSchema.shape,
        },
        safeTool("search", async (args) => {
            const { searchText, pageSize, language, nameSpace } = args;
            if (deps.configService.get("db.atlas")) {
                const [personalities, sentences, claims] = await Promise.all([
                    deps.personalityService.findAll({
                        searchText,
                        pageSize,
                        language,
                    }),
                    deps.sentenceService.findAll({
                        searchText,
                        pageSize,
                        nameSpace,
                    }),
                    deps.claimRevisionService.findAll({
                        searchText,
                        pageSize,
                        nameSpace,
                    }),
                ]);
                return jsonResult({
                    personalities: personalities.processedPersonalities,
                    sentences: sentences.processedSentences,
                    claims: claims.processedRevisions,
                });
            }
            const fallback = await deps.personalityService.combinedListAll({
                name: searchText,
                pageSize,
                language,
            });
            return jsonResult(fallback);
        })
    );

    server.registerTool(
        "list_claims",
        {
            description: "List claims, optionally filtered by personality",
            inputSchema: ListClaimsSchema.shape,
        },
        safeTool("list_claims", async (args) => {
            const query: Record<string, any> = {
                isHidden: false,
                nameSpace: args.nameSpace,
            };
            if (args.personalityId) {
                query.personalities = new mongoose.Types.ObjectId(
                    args.personalityId
                );
            }
            const { data, total } = await deps.claimService.listAll(
                args.page,
                args.pageSize,
                args.order,
                query
            );
            return jsonResult({
                totalClaims: total,
                totalPages: Math.ceil(total / args.pageSize),
                page: args.page,
                claims: data,
            });
        })
    );

    server.registerTool(
        "get_claim",
        {
            description: "Get a claim by id, including its latest revision",
            inputSchema: GetClaimSchema.shape,
        },
        safeTool("get_claim", async (args) =>
            jsonResult(
                await deps.claimService.getById(args.claimId, args.nameSpace)
            )
        )
    );

    server.registerTool(
        "list_personalities",
        {
            description: "List public figures (personalities)",
            inputSchema: ListPersonalitiesSchema.shape,
        },
        safeTool("list_personalities", async (args) =>
            jsonResult(
                await deps.personalityService.combinedListAll({
                    page: args.page,
                    pageSize: args.pageSize,
                    order: args.order,
                    language: args.language,
                    nameSpace: args.nameSpace,
                })
            )
        )
    );

    server.registerTool(
        "get_personality",
        {
            description: "Get a personality by id, with claims",
            inputSchema: GetPersonalitySchema.shape,
        },
        safeTool("get_personality", async (args) =>
            jsonResult(
                await deps.personalityService.getById(args.personalityId, {
                    language: args.language,
                    nameSpace: args.nameSpace,
                })
            )
        )
    );

    server.registerTool(
        "get_claim_review",
        {
            description:
                "Get a published fact-check review by id or data_hash",
            inputSchema: GetClaimReviewSchema.shape as any,
        },
        safeTool("get_claim_review", async (args: any) => {
            const review = args.claimReviewId
                ? await deps.claimReviewService.getById(args.claimReviewId)
                : await deps.claimReviewService.getReviewByDataHash(
                      args.dataHash
                  );
            return jsonResult(review);
        })
    );

    server.registerTool(
        "list_review_tasks",
        {
            description:
                "List fact-checking review tasks by workflow state (unassigned, assigned, reported, published)",
            inputSchema: ListReviewTasksSchema.shape,
        },
        safeTool("list_review_tasks", async (args) =>
            jsonResult(
                await deps.reviewTaskService.listAll({
                    value: args.value,
                    filterUser: {
                        assigned: false,
                        crossChecked: false,
                        reviewed: false,
                    },
                    nameSpace: args.nameSpace,
                    reviewTaskType: args.reviewTaskType,
                    page: args.page,
                    pageSize: args.pageSize,
                    order: args.order,
                })
            )
        )
    );

    server.registerTool(
        "get_review_task",
        {
            description: "Get a review task by id",
            inputSchema: GetReviewTaskSchema.shape,
        },
        safeTool("get_review_task", async (args) =>
            jsonResult(
                await deps.reviewTaskService.getById(args.reviewTaskId)
            )
        )
    );

    server.registerTool(
        "list_verification_requests",
        {
            description: "List verification requests (fact-check intake)",
            inputSchema: ListVerificationRequestsSchema.shape,
        },
        safeTool("list_verification_requests", async (args) =>
            jsonResult(
                await deps.verificationRequestService.listAll({
                    page: args.page,
                    pageSize: String(args.pageSize),
                    order: args.order,
                    topics: args.topics,
                    status: args.status,
                })
            )
        )
    );

    server.registerTool(
        "get_verification_request",
        {
            description: "Get a verification request by id",
            inputSchema: GetVerificationRequestSchema.shape,
        },
        safeTool("get_verification_request", async (args) =>
            jsonResult(
                await deps.verificationRequestService.getById(
                    args.verificationRequestId
                )
            )
        )
    );

    server.registerTool(
        "search_topics",
        {
            description: "Search topics by name or alias",
            inputSchema: SearchTopicsSchema.shape,
        },
        safeTool("search_topics", async (args) =>
            jsonResult(
                await deps.topicService.searchTopics(
                    args.query,
                    args.language
                )
            )
        )
    );

    server.registerTool(
        "list_sources",
        {
            description: "List classified sources (references)",
            inputSchema: ListSourcesSchema.shape,
        },
        safeTool("list_sources", async (args) =>
            jsonResult(
                await deps.sourceService.listAll({
                    page: args.page,
                    pageSize: String(args.pageSize),
                    order: args.order,
                    nameSpace: args.nameSpace,
                })
            )
        )
    );
}
```

- [ ] **Step 6: Create `server/mcp/tools/write-tools.ts`**

Captcha note: the REST controllers validate `recaptcha` before calling services; MCP calls are already authenticated via OAuth, so tools call the services/state machine directly (same trust level as the M2M integration path, which also skips captcha).

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { jsonResult, safeTool } from "./tool-helpers";
import { ContentModelEnum } from "../../types/enums";
import {
    AddReviewCommentSchema,
    CreateClaimSchema,
    CreatePersonalitySchema,
    CreateSourceSchema,
    CreateVerificationRequestSchema,
} from "./schemas";
import type { McpToolDeps } from "../mcp.service";

export function registerWriteTools(server: McpServer, deps: McpToolDeps) {
    server.registerTool(
        "create_verification_request",
        {
            description:
                "Submit content for fact-checking (enters the triage pipeline)",
            inputSchema: CreateVerificationRequestSchema.shape,
        },
        safeTool("create_verification_request", async (args) =>
            jsonResult(
                await deps.verificationRequestStateMachineService.request(
                    {
                        content: args.content,
                        sourceChannel: args.sourceChannel,
                        source: args.source,
                        publicationDate: args.publicationDate,
                        heardFrom: args.heardFrom,
                        nameSpace: args.nameSpace,
                    },
                    deps.request.user
                )
            )
        )
    );

    server.registerTool(
        "add_review_comment",
        {
            description: "Add a comment to a review task (by data_hash)",
            inputSchema: AddReviewCommentSchema.shape,
        },
        safeTool("add_review_comment", async (args) =>
            jsonResult(
                await deps.reviewTaskService.addComment(args.dataHash, {
                    comment: args.comment,
                    text: args.text,
                })
            )
        )
    );

    server.registerTool(
        "create_claim",
        {
            description: "Create a speech-type claim for a personality",
            inputSchema: CreateClaimSchema.shape,
        },
        safeTool("create_claim", async (args) =>
            jsonResult(
                await deps.claimService.create({
                    title: args.title,
                    content: args.content,
                    date: args.date,
                    contentModel: ContentModelEnum.Speech,
                    personalities: [args.personalityId],
                    sources: args.sources,
                    nameSpace: args.nameSpace,
                })
            )
        )
    );

    server.registerTool(
        "create_personality",
        {
            description: "Create a public figure (personality)",
            inputSchema: CreatePersonalitySchema.shape,
        },
        safeTool("create_personality", async (args) =>
            jsonResult(
                await deps.personalityService.create({
                    name: args.name,
                    description: args.description,
                    wikidata: args.wikidata,
                })
            )
        )
    );

    server.registerTool(
        "create_source",
        {
            description: "Register a source URL, optionally linked to a target",
            inputSchema: CreateSourceSchema.shape,
        },
        safeTool("create_source", async (args) =>
            jsonResult(
                await deps.sourceService.create({
                    href: args.href,
                    targetId: args.targetId,
                    user: deps.request.user._id,
                    nameSpace: args.nameSpace,
                })
            )
        )
    );
}
```

- [ ] **Step 7: Create `server/mcp/mcp.service.ts`**

```typescript
import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ClaimService } from "../claim/claim.service";
import { ClaimRevisionService } from "../claim/claim-revision/claim-revision.service";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";
import { SourceService } from "../source/source.service";
import { TopicService } from "../topic/topic.service";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import type { BaseRequest } from "../types";
import { registerReadTools } from "./tools/read-tools";
import { registerWriteTools } from "./tools/write-tools";

export interface McpToolDeps {
    request: BaseRequest;
    configService: ConfigService;
    claimService: ClaimService;
    claimRevisionService: ClaimRevisionService;
    sentenceService: SentenceService;
    personalityService: IPersonalityService;
    claimReviewService: ClaimReviewService;
    reviewTaskService: ReviewTaskService;
    verificationRequestService: VerificationRequestService;
    verificationRequestStateMachineService: VerificationRequestStateMachineService;
    sourceService: SourceService;
    topicService: TopicService;
}

@Injectable({ scope: Scope.REQUEST })
export class McpService {
    constructor(
        @Inject(REQUEST) private readonly request: BaseRequest,
        private readonly configService: ConfigService,
        private readonly claimService: ClaimService,
        private readonly claimRevisionService: ClaimRevisionService,
        private readonly sentenceService: SentenceService,
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService,
        private readonly claimReviewService: ClaimReviewService,
        private readonly reviewTaskService: ReviewTaskService,
        private readonly verificationRequestService: VerificationRequestService,
        private readonly verificationRequestStateMachineService: VerificationRequestStateMachineService,
        private readonly sourceService: SourceService,
        private readonly topicService: TopicService
    ) {}

    buildServer(): McpServer {
        const server = new McpServer({ name: "aletheia", version: "1.0.0" });
        const deps: McpToolDeps = {
            request: this.request,
            configService: this.configService,
            claimService: this.claimService,
            claimRevisionService: this.claimRevisionService,
            sentenceService: this.sentenceService,
            personalityService: this.personalityService,
            claimReviewService: this.claimReviewService,
            reviewTaskService: this.reviewTaskService,
            verificationRequestService: this.verificationRequestService,
            verificationRequestStateMachineService:
                this.verificationRequestStateMachineService,
            sourceService: this.sourceService,
            topicService: this.topicService,
        };
        registerReadTools(server, deps);
        registerWriteTools(server, deps);
        return server;
    }
}
```

- [ ] **Step 8: Create `server/mcp/mcp.controller.ts`**

Stateless Streamable HTTP: a fresh server+transport pair per POST; GET/DELETE answer 405 (no SSE streams, no sessions). `JsonBodyMiddleware` already parses JSON for all routes, so `req.body` is available.

```typescript
import {
    Controller,
    Delete,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Public } from "../auth/decorators/auth.decorator";
import { McpAuthGuard } from "./mcp-auth.guard";
import { McpService } from "./mcp.service";
import type { BaseRequest } from "../types";

@Controller("server/mcp")
export class McpController {
    constructor(private readonly mcpService: McpService) {}

    @Public()
    @UseGuards(McpAuthGuard)
    @Post()
    async handleMcpRequest(@Req() req: BaseRequest, @Res() res: Response) {
        const server = this.mcpService.buildServer();
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        });
        res.on("close", () => {
            transport.close();
            server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req as any, res, req.body);
    }

    @Public()
    @Get()
    methodNotAllowedGet(@Res() res: Response) {
        this.methodNotAllowed(res);
    }

    @Public()
    @Delete()
    methodNotAllowedDelete(@Res() res: Response) {
        this.methodNotAllowed(res);
    }

    private methodNotAllowed(res: Response) {
        res.status(405).json({
            jsonrpc: "2.0",
            error: { code: -32000, message: "Method not allowed" },
            id: null,
        });
    }
}
```

- [ ] **Step 9: Create `server/mcp/mcp.module.ts`**

```typescript
import { Module } from "@nestjs/common";
import { ClaimModule } from "../claim/claim.module";
import { ClaimRevisionModule } from "../claim/claim-revision/claim-revision.module";
import { SentenceModule } from "../claim/types/sentence/sentence.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ReviewTaskModule } from "../review-task/review-task.module";
import { VerificationRequestModule } from "../verification-request/verification-request.module";
import { SourceModule } from "../source/source.module";
import { TopicModule } from "../topic/topic.module";
import { PersonalityModule } from "../personality/personality.module";
import { OryModule } from "../auth/ory/ory.module";
import { McpController } from "./mcp.controller";
import { McpWellKnownController } from "./mcp-well-known.controller";
import { McpService } from "./mcp.service";
import { McpAuthGuard } from "./mcp-auth.guard";

@Module({
    imports: [
        ClaimModule,
        ClaimRevisionModule,
        SentenceModule,
        ClaimReviewModule,
        ReviewTaskModule,
        VerificationRequestModule,
        SourceModule,
        TopicModule,
        PersonalityModule.register(),
        OryModule,
    ],
    controllers: [McpController, McpWellKnownController],
    providers: [McpService, McpAuthGuard],
})
export class McpModule {}
```

Check the actual import style of each module before finalizing: `PersonalityModule` is dynamic (`.register()` — see how `app.module.ts` imports it and copy that call exactly); `OryModule` may export `OryService` under a different module name — find where `OryService` is provided (`server/auth/ory/ory.module.ts`) and confirm it exports the service; if it doesn't, add `exports: [OryService]` there.

- [ ] **Step 10: Type check**

Run: `yarn build-ts` → exit 0. Fix any signature drift between tools and services by adjusting the tool code (services are the source of truth — do NOT change domain services to fit the tools).

- [ ] **Step 11: Commit**

```bash
git add server/mcp server/tests/mcp.e2e.spec.ts
git commit -m "feat(mcp): add MCP module with streamable HTTP endpoint and v1 tools"
```

---

### Task 7: App wiring + configuration

**Files:**
- Modify: `server/app.module.ts`
- Modify: `config.example.yaml`
- Modify: `deployment/config/config-file/modules/service/confBase.pkl`

- [ ] **Step 1: Register `McpModule` conditionally**

In `server/app.module.ts` `register(options)`, follow the existing conditional-module pattern (see `NotificationModule` around line 102) and add to the `imports` array **before** `HomeModule` (which must stay last):

```typescript
        ...(options?.mcp?.enabled ? [McpModule] : []),
```

with the import at the top:

```typescript
import { McpModule } from "./mcp/mcp.module";
```

- [ ] **Step 2: Add config keys**

In `config.example.yaml`, at the same nesting level as the `ory:` block:

```yaml
      mcp:
        enabled: false
        # Public base URL of this deployment, used in OAuth metadata
        public_url: MCP_PUBLIC_URL
        # Optional override; defaults to ory.url
        authorization_server:
```

In `deployment/config/config-file/modules/service/confBase.pkl`, alongside the existing `ory = (oryConfig) {}` assignment (match the file's `read("env:…")` style used in `ory.pkl`):

```pkl
mcp = new {
    enabled = read?("env:MCP_ENABLED") == "true"
    public_url = read?("env:MCP_PUBLIC_URL")
}
```

- [ ] **Step 3: Run the e2e suite from Task 6**

Run: `yarn env-cmd --silent vitest run --project e2e server/tests/mcp.e2e.spec.ts`
Expected: PASS (metadata, initialize, 405, tools/list, list_claims). Debug in this order if not: module import errors → check Step 9 of Task 6; 404 → module not registered / `mcp.enabled` missing from test config; 406 → missing `Accept` header.

- [ ] **Step 4: Run the full test suite**

Run: `yarn test`
Expected: everything green (same failures as `stage` baseline, if any pre-existed).

- [ ] **Step 5: Commit**

```bash
git add server/app.module.ts config.example.yaml deployment/config/config-file/modules/service/confBase.pkl
git commit -m "feat(mcp): wire MCP module behind mcp.enabled config flag"
```

---

### Task 8: Write-tool e2e coverage

**Files:** Modify: `server/tests/mcp.e2e.spec.ts`

- [ ] **Step 1: Add failing tests for write tools**

Append to the describe block. The verification-request state machine drives an AI pipeline (OpenAI etc.), so it is replaced with a spy; personality/source creation runs for real against the per-worker Mongo.

Add imports at the top of the file:

```typescript
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";
```

Add before `.compile()` in `beforeAll`:

```typescript
            .overrideProvider(VerificationRequestStateMachineService)
            .useValue({
                request: vi
                    .fn()
                    .mockResolvedValue({ status: "pre-triage", ok: true }),
            })
```

New tests:

```typescript
    it("creates a personality", async () => {
        const body = await callTool(app, "create_personality", {
            name: "MCP Test Person",
            description: "Created via MCP e2e",
            wikidata: "Q999999",
        });
        expect(body.result.isError).toBeFalsy();
        const created = JSON.parse(body.result.content[0].text);
        expect(created.slug).toBe("mcp-test-person");
    });

    it("creates a source attributed to the authenticated user", async () => {
        const body = await callTool(app, "create_source", {
            href: "https://example.org/mcp-e2e-source",
        });
        expect(body.result.isError).toBeFalsy();
        const created = JSON.parse(body.result.content[0].text);
        expect(created.href).toBe("https://example.org/mcp-e2e-source");
    });

    it("routes verification requests through the state machine with the MCP user", async () => {
        const body = await callTool(app, "create_verification_request", {
            content: "Is this viral message about vaccines true or false?",
        });
        expect(body.result.isError).toBeFalsy();
    });

    it("returns a readable tool error instead of crashing on bad input", async () => {
        const body = await callTool(app, "get_claim", {
            claimId: "not-an-objectid",
        });
        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toContain("get_claim failed");
    });
```

- [ ] **Step 2: Run to verify the new tests fail/pass appropriately**

Run: `yarn env-cmd --silent vitest run --project e2e server/tests/mcp.e2e.spec.ts`
Expected: all tests PASS (fix tool↔service signature mismatches in the tool files if not — the e2e suite is the contract check for the code written blind in Task 6).

- [ ] **Step 3: Commit**

```bash
git add server/tests/mcp.e2e.spec.ts
git commit -m "test(mcp): cover write tools and tool-error handling end to end"
```

---

### Task 9: Documentation + manual verification

**Files:**
- Create: `server/mcp/README.md`

- [ ] **Step 1: Write the README**

```markdown
# Aletheia MCP Server

Remote [Model Context Protocol](https://modelcontextprotocol.io) endpoint at
`POST /server/mcp` (Streamable HTTP, stateless). Lets MCP clients (claude.ai,
Claude Code, Cursor) authenticate as real Aletheia users via OAuth 2.1 and run
fact-checking tools.

## Enabling

Set in `config.yaml` (or env for deployments):

​```yaml
mcp:
  enabled: true            # MCP_ENABLED
  public_url: https://aletheiafact.org   # MCP_PUBLIC_URL
​```

## Ory Network setup (one-time, per environment)

1. In the Ory Network console for the project, enable **OAuth2** (Hydra).
2. Enable **Dynamic Client Registration** (Public endpoints → allow
   `POST /oauth2/register`) so MCP clients can self-register.
3. Use the Ory-hosted **login and consent** screens (Account Experience) —
   no custom consent app is required.

## Auth flow

1. Client POSTs to `/server/mcp` → 401 with
   `WWW-Authenticate: Bearer resource_metadata="…/.well-known/oauth-protected-resource/server/mcp"`.
2. Client reads the metadata, discovers Ory as the authorization server,
   registers via DCR, and runs the authorization-code + PKCE flow in the
   user's browser (Kratos login + consent).
3. Client calls `/server/mcp` with `Authorization: Bearer <token>`.
   `McpAuthGuard` introspects the token via Hydra and resolves the Kratos
   identity to the real user and role; CASL abilities apply as usual.

## Connecting from Claude Code

​```bash
claude mcp add --transport http aletheia https://aletheiafact.org/server/mcp
​```

From claude.ai: Settings → Connectors → Add custom connector →
`https://aletheiafact.org/server/mcp`.

## Tools

Read: `search`, `list_claims`, `get_claim`, `list_personalities`,
`get_personality`, `get_claim_review`, `list_review_tasks`, `get_review_task`,
`list_verification_requests`, `get_verification_request`, `search_topics`,
`list_sources`.
Write: `create_verification_request`, `add_review_comment`, `create_claim`,
`create_personality`, `create_source`.

Tool inputs are Zod-validated (`server/mcp/tools/schemas.ts`). Adding a tool =
schema in `schemas.ts` + registration in `read-tools.ts`/`write-tools.ts`.
```

(Remove the zero-width escapes around the inner code fences when writing the file.)

- [ ] **Step 2: Manual verification with MCP Inspector (local)**

With local dev running (`yarn dev`) and `mcp.enabled: true` + `mcp.public_url: http://localhost:3000` in `config.yaml`:

```bash
npx @modelcontextprotocol/inspector
```

Point it at `http://localhost:3000/server/mcp` (Streamable HTTP). Expected: 401 challenge visible without auth; with local Ory OAuth configured, full login → `tools/list` shows 17 tools → `list_claims` returns data. If local Hydra isn't configured, verify the 401 + metadata endpoints with curl instead:

```bash
curl -i http://localhost:3000/server/mcp -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
# Expect: 401 with WWW-Authenticate header
curl -s http://localhost:3000/.well-known/oauth-protected-resource/server/mcp
# Expect: JSON with resource + authorization_servers
```

- [ ] **Step 3: Final checks and commit**

Run: `yarn build-ts && yarn lint && yarn test` → all green.

```bash
git add server/mcp/README.md
git commit -m "docs(mcp): add MCP server setup and connection guide"
```

- [ ] **Step 4: Open the PR**

Target branch `stage` (repo convention). Use the finishing-a-development-branch skill. PR body should call out: the new `mcp.enabled` flag (default off), the Ory Network console prerequisites (OAuth2 + DCR + hosted consent) that must be done on stage before enabling, and that `McpAuthGuard` fixes user-bearer-token role resolution only for the MCP route (global M2M behavior unchanged).

---

## Deviations from spec (intentional)

- `list_topics` became `search_topics` — `TopicService` has no `listAll`; `searchTopics(query, language)` is the real API.
- The e2e suite mocks `VerificationRequestStateMachineService` because the real machine calls the AI pipeline; the machine itself is covered by its own existing tests.

## Known follow-ups (out of scope)

- Review-task state transitions and admin tools (deliberately excluded from v1).
- SSE streaming / session mode (stateless JSON is enough for current clients).
- Lifting the module into a standalone `mcp.aletheiafact.org` service if load demands it.
