import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { z } from "zod";
import { toError } from "../util/error-handling";

const CallbackParamsSchema = z.object({
    targetId: z.string().min(1),
    field: z.string().min(1),
});

const CallbackResultSchema = z.any();

type CallbackParams = { targetId: string; field: string };
type CallbackResult = z.infer<typeof CallbackResultSchema>;
// Which AI task produced the result, so handlers can record its origin
export type CallbackMeta = { taskId?: string; model?: string };
type CallbackHandler = (
    params: CallbackParams,
    result: CallbackResult,
    meta: CallbackMeta
) => Promise<unknown>;

@Injectable()
export class CallbackDispatcherService {
    private readonly logger = new Logger(CallbackDispatcherService.name);
    private handlers: Record<string, CallbackHandler> = {};

    register(routeKey: string, handler: CallbackHandler) {
        if (this.handlers[routeKey]) {
            this.logger.warn(
                `Overwriting existing handler for key: ${routeKey}`
            );
        }
        this.handlers[routeKey] = handler;
        this.logger.log(`Registered callback handler for key: ${routeKey}`);
    }

    async dispatch(
        routeKey: string,
        params: unknown,
        result: unknown,
        meta: CallbackMeta = {}
    ) {
        const handler = this.handlers[routeKey];
        if (!handler) {
            this.logger.error(`No handler registered for key: ${routeKey}`);
            return;
        }

        try {
            const validatedParams = CallbackParamsSchema.parse(
                params
            ) as CallbackParams;
            const validatedResult = CallbackResultSchema.parse(result);

            await handler(validatedParams, validatedResult, meta);
            this.logger.log(
                `Successfully dispatched callback for key: ${routeKey}`
            );
        } catch (err) {
            if (err instanceof z.ZodError) {
                this.logger.error(
                    `Invalid callback parameters for key: ${routeKey}`,
                    err.issues
                );
                throw new BadRequestException("Invalid callback parameters");
            }

            const error = toError(err);
            this.logger.error(
                `Error dispatching callback for key: ${routeKey}`,
                error.message
            );
            throw err;
        }
    }
}
