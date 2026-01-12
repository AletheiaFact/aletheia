import { Model } from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { VerificationRequestStateMachineService } from "../../state-machine/verification-request.state-machine.service";
import { SourceService } from "../../../source/source.service";
import { GroupService } from "../../../group/group.service";
import { HistoryService } from "../../../history/history.service";
import { AiTaskService } from "../../../ai-task/ai-task.service";
import { TopicService } from "../../../topic/topic.service";
import { VerificationRequestService } from "../../verification-request.service";
import { VerificationRequestDocument } from "../../schemas/verification-request.schema";

const mockQuery = {
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

const mockVerificationRequestModel = {
  find: jest.fn().mockReturnValue(mockQuery),
  aggregate: jest.fn().mockReturnThis(),
};

const createVRTestingModule = async () => {
  const module: TestingModule = await Test.createTestingModule({
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

  const service = await module.resolve<VerificationRequestService>(VerificationRequestService);
  const model = module.get<Model<VerificationRequestDocument>>(getModelToken("VerificationRequest"));

  return { service, model, module };
};

export { createVRTestingModule, mockVerificationRequestModel, mockQuery };