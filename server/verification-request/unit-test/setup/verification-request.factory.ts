import { VerificationRequestDocument } from "../../schemas/verification-request.schema";

export const createFakeVerificationRequest = (overrides?: Partial<VerificationRequestDocument>) => ({
  _id: "60c72b2f9f1b2c3d4e5f6a7b",
  status: "In Triage",
  sourceChannel: "Whatsapp",
  data_hash: "AABBCCDD1122334455667788",
  updatedAt: new Date(),
  ...overrides,
});