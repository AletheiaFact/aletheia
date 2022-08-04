import { SetMetadata } from "@nestjs/common";
import { UserRoles } from "./roles.enum";

// const ROLES_KEY = "roles"
export const Roles = (...roles: UserRoles[]) => SetMetadata("roles", roles);
