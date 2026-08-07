import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { ViewService } from "../view/view.service";
import { ConfigService } from "@nestjs/config";
import { UtilService } from "../util";
import { CaptchaService } from "../captcha/captcha.service";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { SessionOrM2MGuard } from "../auth/m2m-or-session.guard";

describe("UsersController — deleteMyAccount", () => {
    let controller: UsersController;
    const usersService = { deleteAccount: vi.fn() };
    const allowGuard = { canActivate: () => true };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: UsersService, useValue: usersService },
                { provide: ViewService, useValue: {} },
                { provide: ConfigService, useValue: { get: vi.fn() } },
                { provide: UtilService, useValue: {} },
                { provide: CaptchaService, useValue: {} },
            ],
        })
            .overrideGuard(AbilitiesGuard)
            .useValue(allowGuard)
            .overrideGuard(SessionOrM2MGuard)
            .useValue(allowGuard)
            .compile();

        controller = module.get<UsersController>(UsersController);
    });

    beforeEach(() => vi.clearAllMocks());

    it("deletes the caller's own account using the session id", async () => {
        const json = vi.fn();
        const res: any = { status: vi.fn().mockReturnValue({ json }) };
        const req: any = { user: { _id: "session-user-id" } };

        await controller.deleteMyAccount(req, res);

        expect(usersService.deleteAccount).toHaveBeenCalledWith(
            "session-user-id"
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true })
        );
    });
});
