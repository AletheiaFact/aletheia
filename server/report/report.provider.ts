import type { IReportService } from "../interfaces/report.service.interface";
import { Provider } from "@nestjs/common";
import { MongoReportService } from "./mongo/report.service";
import { PostgresReportService } from "./postgres/report.service";
import { createDbServiceProvider } from "../database/db-service.provider";

export const reportServiceProvider: Provider =
    createDbServiceProvider<IReportService>(
        "ReportService",
        MongoReportService,
        PostgresReportService
    );
