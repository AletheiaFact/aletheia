import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../../app.module";
import { SessionGuard } from "../../auth/session.guard";
import { SessionGuardMock } from "../mocks/SessionGuardMock";
import { SessionOrM2MGuard } from "../../auth/m2m-or-session.guard";
import { SessionOrM2MGuardMock } from "../mocks/SessionOrM2MGuardMock";
import { M2MGuard } from "../../auth/m2m.guard";
import { M2MGuardMock } from "../mocks/M2MGuardMock";
import { AbilitiesGuard } from "../../auth/ability/abilities.guard";
import { AbilitiesGuardMock } from "../mocks/AbilitiesGuardMock";
import { HistoryService } from "../../history/history.service";
import { HistoryServiceMock } from "../mocks/HistoryServiceMock";
import { McpAuthGuard } from "../../mcp/mcp-auth.guard";
import { TestConfigOptions } from "./TestConfigOptions";
import { SeedTestUser } from "./SeedTestUser";
import { SeedTestNameSpace } from "./SeedTestNameSpace";
import { AdminUserMock } from "./AdminUserMock";
import { VerificationRequestStateMachineService } from "../../verification-request/state-machine/verification-request.state-machine.service";

export const MCP_ACCEPT = "application/json, text/event-stream";

export const adminUser = () => ({
    isM2M: false,
    _id: AdminUserMock._id.toString(),
    id: AdminUserMock._id.toString(),
    role: { main: "admin" },
    status: "active",
});

export const regularUser = () => ({
    ...adminUser(),
    role: { main: "regular" },
});

export const m2mUser = () => ({
    isM2M: true,
    clientId: "mcp-client",
    subject: "mcp-client",
    role: { main: "integration" },
    namespace: "main",
});

// Mutable so individual tests can inject a different authenticated user
// shape (role, namespace membership, M2M) before issuing a tool call.
export const authState: { user: any } = { user: adminUser() };

const McpAuthGuardMock = {
    canActivate: (context: any) => {
        const request = context.switchToHttp().getRequest();
        request.user = authState.user;
        return true;
    },
};

// Shared across every test in a file: lets specs assert the state machine
// was reached with the MCP user, not just that the tool returned no error.
export const verificationRequestStateMachineMock = {
    request: vi.fn().mockResolvedValue({ status: "pre-triage", ok: true }),
};

export function rpc(method: string, params: any = {}, id = 1) {
    return { jsonrpc: "2.0", id, method, params };
}

export async function callTool(app: any, name: string, args: any = {}) {
    const res = await request(app.getHttpServer())
        .post("/api/mcp")
        .set("Accept", MCP_ACCEPT)
        .send(rpc("tools/call", { name, arguments: args }))
        .expect(200);
    return res.body;
}

/**
 * Boots the full Nest app with the MCP auth guard swapped for a mock that
 * reads `authState.user`. Registers beforeAll/afterAll/beforeEach hooks in
 * the calling describe block and returns a handle whose `app` is set once
 * the module has initialised.
 */
export function useMcpTestHelper() {
    const handle: { app: any } = { app: undefined };

    beforeAll(async () => {
        const mongoUri = process.env.MONGO_URI!;
        await SeedTestUser(mongoUri);
        // Seeds the "secret" (admin is a member) and "forbidden" (no
        // members) NameSpace documents used by the DB-membership tests (C1).
        await SeedTestNameSpace(mongoUri);

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
            .overrideProvider(VerificationRequestStateMachineService)
            .useValue(verificationRequestStateMachineMock)
            .compile();

        handle.app = moduleFixture.createNestApplication();
        handle.app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                whitelist: true,
                forbidNonWhitelisted: true,
            })
        );
        await handle.app.init();
    });

    afterAll(async () => {
        await handle.app?.close();
    });

    beforeEach(() => {
        authState.user = adminUser();
        verificationRequestStateMachineMock.request.mockClear();
    });

    return handle;
}
