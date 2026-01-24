import { Types } from "mongoose";
import { VerificationRequestDocument } from "../verification-request/schemas/verification-request.schema";
import { VerificationRequestSourceChannel, VerificationRequestStatus } from "../verification-request/dto/types";

export const createFakeVerificationRequest = (
  overrides?: Partial<VerificationRequestDocument>
): Partial<VerificationRequestDocument> => ({
  _id: new Types.ObjectId("60c72b2f9f1b2c3d4e5f6a7b"),
  status: VerificationRequestStatus.IN_TRIAGE,
  sourceChannel: VerificationRequestSourceChannel.Whatsapp,
  data_hash: "AABBCCDD1122334455667788",
  updatedAt: new Date(),
  ...overrides,
});

export const mockQuery = {
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

export const mockVerificationRequestModel = {
  find: jest.fn().mockReturnValue(mockQuery),
  aggregate: jest.fn().mockReturnThis(),
};