import { Badge } from "./Badge";
import { Roles, Status } from "./enums";

export type User = {
    _id: string;
    name: string;
    email: string;
    role: Roles;
    badges: Badge[];
    state: Status;
    totp: boolean;
};
