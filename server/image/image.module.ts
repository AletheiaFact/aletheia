import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FileManagementModule } from "../file-management/file-management.module";
import { HistoryModule } from "../history/history.module";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";
import { Image, ImageSchema } from "./schemas/image.schema";

const ImageModel = MongooseModule.forFeature([
    {
        name: Image.name,
        schema: ImageSchema,
    },
]);

@Module({
    imports: [ImageModel, HistoryModule, FileManagementModule],
    providers: [ImageService],
    exports: [ImageService],
    controllers: [ImageController],
})
export class ImageModule {}
