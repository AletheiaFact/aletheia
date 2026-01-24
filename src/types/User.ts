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

export class M2M {
    isM2M: boolean;
    subject: string;
    role: {
        main: string;
    };
    scopes: string[];
}
