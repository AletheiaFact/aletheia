import { Test, TestingModule } from "@nestjs/testing";
import { ClaimController } from "./claim.controller";
import { CaptchaService } from "../captcha/captcha.service";
import { DebateService } from "./types/debate/debate.service";
import { ParserService } from "./parser/parser.service";
import { mockClaimService, mockPersonalityService } from "../mocks/ClaimMock";

import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { GetByDataHashDto } from "./dto/get-by-datahash.dto";

describe("ClaimController (Unit)", () => {
    let controller: ClaimController;
    let testingModule: TestingModule;

    beforeEach(async () => {
        testingModule = await Test.createTestingModule({
            controllers: [ClaimController],
            providers: [
                {
                    provide: "PersonalityService",
                    useValue: mockPersonalityService(),
                },
                { provide: "ClaimService", useValue: mockClaimService() },
                { provide: CaptchaService, useValue: {} },
                { provide: DebateService, useValue: {} },
                { provide: ParserService, useValue: {} },
                { provide: "ClaimRevisionService", useValue: {} },
                { provide: "REQUEST", useValue: {} },
            ],
        })
            .overrideGuard(AbilitiesGuard)
            .useValue({})
            .compile();

        controller = testingModule.get<ClaimController>(ClaimController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("GetByDataHashDto", () => {
        it("should accept valid data_hash", () => {
            expect(() =>
                GetByDataHashDto.parse({
                    data_hash: "96cffa6efb4c5732c46dfed98be707a5",
                })
            ).not.toThrow();
        });

        it("should throw when data_hash is invalid", () => {
            expect(() =>
                GetByDataHashDto.parse({
                    data_hash: 123,
                })
            ).toThrow();
        });

        it("should throw when data_hash is empty", () => {
            expect(() =>
                GetByDataHashDto.parse({
                    data_hash: "",
                })
            ).toThrow();
        });
    });
});
