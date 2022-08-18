import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HistoryModule } from "../history/history.module";
import { ImageService } from "./image.service";
import { Image, ImageSchema } from "./schemas/image.schema";

const ImageModel = MongooseModule.forFeature([
    {
        name: Image.name,
        schema: ImageSchema,
    },
]);

@Module({
    imports: [ImageModel, HistoryModule],
    providers: [ImageService],
    exports: [ImageService],
})
export class ImageModule {}
