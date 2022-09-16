import { Controller, Post, UseInterceptors } from "@nestjs/common";
import { UploadedFiles } from "@nestjs/common/decorators/http/route-params.decorator";
import { FilesInterceptor } from "@nestjs/platform-express/multer";
import { ImageService } from "./image.service";

@Controller()
export class ImageController {
    constructor(private imageService: ImageService) {}

    @Post("api/image")
    @UseInterceptors(FilesInterceptor("files"))
    async create(@UploadedFiles() files: Express.Multer.File[]) {
        return Promise.all(
            files.map(async (file) => {
                return await this.imageService.create(file, "user");
            })
        );
    }
}
