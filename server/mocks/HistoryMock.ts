import { VerificationRequestStatus } from "../verification-request/dto/types";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { Types } from "mongoose";

export const historyServiceMock = {
  getHistoryForTarget: jest.fn(),
};

export const mockHistoryItem = {
  _id: "23432",
  targetId: new Types.ObjectId(),
  targetModel: TargetModel.VerificationRequest,
  type: HistoryType.Update,
  date: new Date(),
  details: {
    after: {
      description: "new",
      status: VerificationRequestStatus.PRE_TRIAGE,
    },
    before: {
      description: "old",
      status: VerificationRequestStatus.IN_TRIAGE,
    },
  },
};

export const mockHistoryResponse = {
  history: [mockHistoryItem],
  totalChanges: 1,
  totalPages: 1,
  page: 0,
  pageSize: 10,
};

export const mockAggregateMongoResult = [
  {
    data: [mockHistoryItem],
    totalCount: [{ total: 1 }],
  },
];

type MockedModel = jest.Mock & {
  aggregate: jest.Mock;
};

export const mockHistoryModel = jest.fn() as MockedModel;

mockHistoryModel.mockImplementation(function (this: any, data) {
  this.save = jest.fn().mockResolvedValue({
    ...mockHistoryItem,
    _id: "abc",
  });
});

mockHistoryModel.aggregate = jest.fn();
