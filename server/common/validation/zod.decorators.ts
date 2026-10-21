import { Body, Logger, Param, Query } from "@nestjs/common";
import { ApiBody, ApiParam, ApiQuery } from "@nestjs/swagger";
import type { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { z } from "zod";
import { ZodValidationPipe } from "./zod-validation.pipe";

const logger = new Logger("ZodSwagger");

// Runs at import time via the decorators, so it must never throw.
export function toOpenApiSchema(schema: z.ZodType): SchemaObject {
    try {
        return z.toJSONSchema(schema, {
            target: "openapi-3.0",
            io: "input",
            unrepresentable: "any",
        }) as SchemaObject;
    } catch (error) {
        logger.warn(`Could not derive OpenAPI schema: ${String(error)}`);
        return {};
    }
}

function applyToMethod(
    decorator: MethodDecorator,
    target: object,
    key: string | symbol | undefined
) {
    if (key === undefined) return;
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    if (descriptor) decorator(target, key, descriptor);
}

export function ZodBody<T extends z.ZodType>(schema: T): ParameterDecorator {
    return (target, key, index) => {
        Body(new ZodValidationPipe(schema))(target, key, index);
        applyToMethod(
            ApiBody({ schema: toOpenApiSchema(schema) }),
            target,
            key
        );
    };
}

export function ZodQuery<T extends z.ZodObject>(schema: T): ParameterDecorator {
    return (target, key, index) => {
        Query(new ZodValidationPipe(schema))(target, key, index);
        const json = toOpenApiSchema(schema);
        const required = new Set(json.required ?? []);
        for (const [name, property] of Object.entries(json.properties ?? {})) {
            applyToMethod(
                ApiQuery({
                    name,
                    required: required.has(name),
                    schema: property as SchemaObject,
                }),
                target,
                key
            );
        }
    };
}

export function ZodParam<T extends z.ZodType>(
    name: string,
    schema: T
): ParameterDecorator {
    return (target, key, index) => {
        Param(name, new ZodValidationPipe(schema))(target, key, index);
        applyToMethod(
            ApiParam({ name, schema: toOpenApiSchema(schema) }),
            target,
            key
        );
    };
}
