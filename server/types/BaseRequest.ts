import { Request } from "express";

export type BaseRequest = Request & {
    user: { _id: string },
    language: string
}
