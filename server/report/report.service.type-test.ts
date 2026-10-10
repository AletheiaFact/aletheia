import type { IReportService } from "../interfaces/report.service.interface";
import type { MongoReportService } from "./mongo/report.service";
import type { PostgresReportService } from "./postgres/report.service";
import type { ExactlyImplements } from "../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<
    MongoReportService,
    IReportService
> = true;
export const _pgExact: ExactlyImplements<
    PostgresReportService,
    IReportService
> = true;
