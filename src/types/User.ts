import { Roles } from "./enums";

export type User = {
    _id: string;
    name: string;
    email: string;
    role: Roles;
    badges: string[];
};
