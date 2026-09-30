import { BadRequestException, Paramtype } from "@nestjs/common";
import { z } from "zod";

export interface ValidationIssue {
    path: string;
    code: string;
    message: string;
}

export class ZodValidationException extends BadRequestException {
    constructor(
        public readonly zodError: z.ZodError,
        public readonly target: Paramtype | "unknown" = "unknown"
    ) {
        super({
            statusCode: 400,
            error: "Bad Request",
            message: "Validation failed",
            target,
            issues: toValidationIssues(zodError),
        });
    }
}

export function toValidationIssues(error: z.ZodError): ValidationIssue[] {
    return error.issues.map((issue) => ({
        path: issue.path.map(String).join("."),
        code: issue.code,
        message: issue.message,
    }));
}
