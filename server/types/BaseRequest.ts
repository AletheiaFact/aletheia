import { Roles } from "../ability/ability.factory";
import { Request } from "express";

export type BaseRequest = Request & {
    user: { _id: string; role: Roles };
    language: string;
};
