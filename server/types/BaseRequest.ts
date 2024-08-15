import { Roles } from "../auth/ability/ability.factory";
import type { Request } from "express";

export type BaseRequest = Request & {
    user: {
        _id: string;
        role: { main: Roles };
        status: string;
        agenciaAccessToken: string;
        agenciaRefreshToken: string;
    };
    language: string;
};
