import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { TelemetryService } from "./telemetry.service";

@Injectable()
export class TelemetryMiddleware implements NestMiddleware {
    constructor(private readonly telemetryService: TelemetryService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const startTime = Date.now();

        // Track active connections
        this.telemetryService.incrementActiveConnections();

        // Record metrics when response finishes
        res.on("finish", () => {
            const duration = Date.now() - startTime;
            const route = req.route?.path || req.path;


            this.telemetryService.recordHttpRequest(
                req.method,
                route,
                res.statusCode,
                duration
            );

            this.telemetryService.decrementActiveConnections();
        });

        next();
    }
}
