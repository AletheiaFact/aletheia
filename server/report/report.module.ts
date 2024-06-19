import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { Report, ReportSchema } from "./schemas/report.schema";
import { ReportService } from "./report.service";
import { SourceModule } from "../source/source.module";
import { ReportController } from "./report.controller";

const ReportModel = MongooseModule.forFeature([
    {
        name: Report.name,
        schema: ReportSchema,
    },
]);

@Module({
    imports: [ReportModel, ConfigModule, forwardRef(() => SourceModule)],
    exports: [ReportService],
    providers: [ReportService],
    controllers: [ReportController],
})
export class ReportModule {}
