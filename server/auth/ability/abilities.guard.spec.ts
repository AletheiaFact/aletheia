import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AbilitiesGuard } from "./abilities.guard";
import { AbilityFactory, Action, Roles } from "./ability.factory";
import { User } from "../../entities/user.entity";

describe("AbilitiesGuard", () => {
    let guard: AbilitiesGuard;
    let reflector: Reflector;
    let abilityFactory: AbilityFactory;

    const createMockContext = (user: any = null, namespace = "main"): ExecutionContext => {
        return {
            getHandler: vi.fn(),
            getClass: vi.fn(),
            switchToHttp: () => ({
                getRequest: () => ({
                    user,
                    params: { namespace },
                }),
                getResponse: () => ({}),
            }),
        } as unknown as ExecutionContext;
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AbilitiesGuard, Reflector, AbilityFactory],
        }).compile();

        guard = module.get<AbilitiesGuard>(AbilitiesGuard);
        reflector = module.get<Reflector>(Reflector);
        abilityFactory = module.get<AbilityFactory>(AbilityFactory);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return false when no user is present on request", async () => {
        const context = createMockContext(null);
        vi.spyOn(reflector, "get").mockReturnValue([]);

        const result = await guard.canActivate(context);
        expect(result).toBe(false);
    });

    it("should return true when no rules are defined", async () => {
        const user = new User();
        user.isM2M = false;
        user.role = { main: Roles.Regular };

        const context = createMockContext(user);
        vi.spyOn(reflector, "get").mockReturnValue([]);

        const result = await guard.canActivate(context);
        expect(result).toBe(true);
    });

    it("should allow Admin to pass Manage rule", async () => {
        const user = new User();
        user.isM2M = false;
        user.role = { main: Roles.Admin };

        const context = createMockContext(user);
        vi.spyOn(reflector, "get").mockReturnValue([
            { action: Action.Manage, subject: User },
        ]);

        const result = await guard.canActivate(context);
        expect(result).toBe(true);
    });

    it("should throw UnauthorizedException when Regular user tries Manage action", async () => {
        const user = new User();
        user.isM2M = false;
        user.role = { main: Roles.Regular };

        const context = createMockContext(user);
        vi.spyOn(reflector, "get").mockReturnValue([
            { action: Action.Manage, subject: User },
        ]);

        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
    });

    it("should allow FactChecker to pass Create rule", async () => {
        const user = new User();
        user.isM2M = false;
        user.role = { main: Roles.FactChecker };

        const context = createMockContext(user);
        vi.spyOn(reflector, "get").mockReturnValue([
            { action: Action.Create, subject: User },
        ]);

        const result = await guard.canActivate(context);
        expect(result).toBe(true);
    });

    it("should throw UnauthorizedException when Regular user tries Create action", async () => {
        const user = new User();
        user.isM2M = false;
        user.role = { main: Roles.Regular };

        const context = createMockContext(user);
        vi.spyOn(reflector, "get").mockReturnValue([
            { action: Action.Create, subject: User },
        ]);

        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
    });

    it("should use namespace from request params", async () => {
        const user = new User();
        user.isM2M = false;
        user.role = { main: Roles.Regular } as any;
        (user.role as any)["custom-ns"] = Roles.Admin;

        const context = createMockContext(user, "custom-ns");
        vi.spyOn(reflector, "get").mockReturnValue([
            { action: Action.Manage, subject: User },
        ]);

        const result = await guard.canActivate(context);
        expect(result).toBe(true);
    });

    it("should default to main namespace when no namespace param", async () => {
        const user = new User();
        user.isM2M = false;
        user.role = { main: Roles.Admin };

        const context = {
            getHandler: vi.fn(),
            getClass: vi.fn(),
            switchToHttp: () => ({
                getRequest: () => ({
                    user,
                    params: {},
                }),
                getResponse: () => ({}),
            }),
        } as unknown as ExecutionContext;

        vi.spyOn(reflector, "get").mockReturnValue([
            { action: Action.Manage, subject: User },
        ]);

        const result = await guard.canActivate(context);
        expect(result).toBe(true);
    });
});
