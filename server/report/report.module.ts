import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { Report, ReportSchema } from "./mongo/schemas/report.schema";
import { MongoReportService } from "./mongo/report.service";
import { PostgresReportService } from "./postgres/report.service";
import { reportServiceProvider } from "./report.provider";
import { SourceModule } from "../source/source.module";
import { ReportController } from "./report.controller";
import dbConfig from "../config/db.config";

const ReportModel = MongooseModule.forFeature([
    {
        name: Report.name,
        schema: ReportSchema,
    },
]);

// Static on purpose: this module sits in forwardRef cycles (image, review-task
// → report → source → …), and Nest 9 cannot forwardRef a dynamic module from
// another dynamic module. The DB_TYPE branch is resolved inline instead.
@Module({
    imports: [
        ...(dbConfig.type === "mongodb" ? [ReportModel] : []),
        ConfigModule,
        forwardRef(() => SourceModule.register()),
    ],
    providers: [
        reportServiceProvider,
        dbConfig.type === "postgres"
            ? PostgresReportService
            : MongoReportService,
    ],
    exports: ["ReportService"],
    controllers: [ReportController],
})
export class ReportModule {}
