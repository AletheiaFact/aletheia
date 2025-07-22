import { Injectable, Logger } from "@nestjs/common";

type CallbackHandler = (params: any, result: any) => Promise<void>;

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

    async dispatch(routeKey: string, params: any, result: any) {
        const handler = this.handlers[routeKey];
        if (!handler) {
            this.logger.error(`No handler registered for key: ${routeKey}`);
            return;
        }
        try {
            await handler(params, result);
            this.logger.log(
                `Successfully dispatched callback for key: ${routeKey}`
            );
        } catch (err) {
            this.logger.error(
                `Error dispatching callback for key: ${routeKey}`,
                err.stack
            );
        }
    }
}
