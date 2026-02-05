import { PerformedBy } from "../types/History";
import { M2M, User } from "../types/User";

export function isM2M(user: PerformedBy): user is M2M {
  return !!user && typeof user === "object" && "isM2M" in user;
}

export function isUser(user: PerformedBy): user is User {
  return !!user && typeof user === "object" && "name" in user;
}