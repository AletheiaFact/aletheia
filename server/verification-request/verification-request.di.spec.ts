import { Inject, Injectable, Scope } from "@nestjs/common";
import { ModuleRef, REQUEST } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { MongoVerificationRequestService } from "./mongo/verification-request.service";
import { VerificationRequestStateMachineService } from "./state-machine/verification-request.state-machine.service";
import { verificationRequestServiceProvider } from "./verification-request.provider";
import { HistoryService } from "../history/history.service";
import { AiTaskService } from "../ai-task/ai-task.service";
import { EMBEDDINGS_PROVIDER } from "../llm/llm.tokens";

// The cycle is backend-agnostic; pin the provider to Mongo so the suite also
// runs in the DB_TYPE=postgres CI jobs.
vi.mock("../config/db.config", () => ({ default: { type: "mongodb" } }));

// Stands in for the request-scoped services behind "SourceService" & co. in
// the real module: an async dependency in the tree is what made Nest hand the
// DB provider factory an unconstructed placeholder of the service.
@Injectable({ scope: Scope.REQUEST })
class RequestScopedDependency {
    constructor(@Inject(REQUEST) readonly req: unknown) {}
}

// The AI-task callbacks resolve the service via ModuleRef outside an HTTP
// request; it must come back fully constructed, not as a bare prototype.
describe("VerificationRequestService DI resolution", () => {
    let moduleRef: ModuleRef;

    beforeAll(async () => {
        const testingModule = await Test.createTestingModule({
            providers: [
                verificationRequestServiceProvider,
                VerificationRequestStateMachineService,
                MongoVerificationRequestService,
                RequestScopedDependency,
                { provide: getModelToken("VerificationRequest"), useValue: {} },
                {
                    provide: "SourceService",
                    useFactory: (dependency: unknown) => dependency,
                    inject: [RequestScopedDependency],
                },
                { provide: "GroupService", useValue: {} },
                { provide: HistoryService, useValue: {} },
                { provide: AiTaskService, useValue: {} },
                { provide: "TopicService", useValue: {} },
                { provide: "PersonalityService", useValue: {} },
                { provide: EMBEDDINGS_PROVIDER, useValue: {} },
            ],
        }).compile();
        moduleRef = testingModule.get(ModuleRef);
    });

    it("resolves a constructed service by its token", async () => {
        const service = await moduleRef.resolve("VerificationRequestService");

        expect(service).toBeInstanceOf(MongoVerificationRequestService);
        expect(service.logger).toBeDefined();
        expect(service.VerificationRequestModel).toBeDefined();
    });

    it("hands the state machine a constructed service", async () => {
        const stateMachine = await moduleRef.resolve(
            VerificationRequestStateMachineService
        );
        const service = (stateMachine as any).verificationRequestService;

        expect(service).toBeInstanceOf(MongoVerificationRequestService);
        expect(service.logger).toBeDefined();
    });
});
