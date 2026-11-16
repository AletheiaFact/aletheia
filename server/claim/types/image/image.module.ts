import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReportModule } from "../../../report/report.module";
import { HistoryModule } from "../../../history/history.module";
import { MongoImageService } from "./mongo/image.service";
import { PostgresImageService } from "./postgres/image.service";
import { imageServiceProvider } from "./image.provider";
import { Image, ImageSchema } from "./mongo/schemas/image.schema";
import { ImageController } from "./image.controller";
import dbConfig from "../../../config/db.config";

const ImageModel = MongooseModule.forFeature([
    {
        name: Image.name,
        schema: ImageSchema,
    },
]);

// Static on purpose: this module forwardRefs the report cycle (image →
// report → source → …), and Nest 9 cannot forwardRef a dynamic module from
// another dynamic module. The DB_TYPE branch is resolved inline instead.
@Module({
    imports: [
        ...(dbConfig.type === "mongodb" ? [ImageModel] : []),
        HistoryModule,
        forwardRef(() => ReportModule),
    ],
    controllers: [ImageController],
    providers: [
        imageServiceProvider,
        dbConfig.type === "postgres" ? PostgresImageService : MongoImageService,
    ],
    exports: ["ImageService"],
})
export class ImageModule {}
