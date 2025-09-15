import { ObjectId } from "mongodb";

export const AdminUserMock = {
    _id: new ObjectId("62585756d665dc7bf4b14aa3"),
    email: "test-e2e@aletheiafact.org",
    firstPasswordChanged: true,
    hash: null,
    name: "Test User",
    oryId: null,
    salt: null,
};
