import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationException } from "./zod-validation.exception";

// Non-Zod errors (bugs in a transform/refine) propagate as 500s, not 400s.
@Injectable()
export class ZodValidationPipe<T extends z.ZodType>
    implements PipeTransform<unknown, Promise<z.output<T>>>
{
    constructor(private readonly schema: T) {}

    async transform(
        value: unknown,
        metadata?: ArgumentMetadata
    ): Promise<z.output<T>> {
        const result = await this.schema.safeParseAsync(value);
        if (result.success) {
            return result.data;
        }
        throw new ZodValidationException(result.error, metadata?.type);
    }
}
