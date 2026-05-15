// Workaround for @nestjs/mongoose v8 broken decorator typings under strictNullChecks.
// Constructor parameter decorators pass `undefined` as `key`, but v8 types require `string | symbol`.
// Remove this file when upgrading @nestjs/mongoose to v9+.
import "@nestjs/mongoose";

declare module "@nestjs/mongoose" {
    export function InjectModel(
        model: string
    ): (
        target: object,
        key: string | symbol | undefined,
        index?: number
    ) => void;

    export function InjectConnection(
        name?: string
    ): (
        target: object,
        key: string | symbol | undefined,
        index?: number
    ) => void;
}
