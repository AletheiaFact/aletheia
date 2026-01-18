import { Model } from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { VerificationRequestService } from "./verification-request.service";
import { VerificationRequestDocument } from "./schemas/verification-request.schema";
import { VerificationRequestStateMachineService } from "./state-machine/verification-request.state-machine.service";
import { SourceService } from "../source/source.service";
import { GroupService } from "../group/group.service";
import { HistoryService } from "../history/history.service";
import { AiTaskService } from "../ai-task/ai-task.service";
import { TopicService } from "../topic/topic.service";
import { mockVerificationRequestModel } from "./verification-request-stats.service.spec";

describe("VerificationRequestService (Unit)", () => {
  let testingModule: TestingModule;
  let service: VerificationRequestService;
  let model: Model<VerificationRequestDocument>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        VerificationRequestService,
        {
          provide: getModelToken("VerificationRequest"),
          useValue: mockVerificationRequestModel,
        },
        {
          provide: "REQUEST",
          useValue: { user: { id: "test-user" } },
        },
        { provide: VerificationRequestStateMachineService, useValue: {} },
        { provide: SourceService, useValue: {} },
        { provide: GroupService, useValue: {} },
        { provide: HistoryService, useValue: {} },
        { provide: AiTaskService, useValue: {} },
        { provide: TopicService, useValue: {} },
        { provide: "PersonalityService", useValue: {} },
      ],
    }).compile();

    model = testingModule.get<Model<VerificationRequestDocument>>(
      getModelToken("VerificationRequest")
    );
  });

  beforeEach(async () => {
    service = await testingModule.resolve<VerificationRequestService>(
      VerificationRequestService
    );
    
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});