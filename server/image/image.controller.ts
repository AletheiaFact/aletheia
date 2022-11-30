import { Controller, HttpStatus, Post, UseInterceptors } from "@nestjs/common";
import {
    Res,
    UploadedFiles,
} from "@nestjs/common/decorators/http/route-params.decorator";
import { FilesInterceptor } from "@nestjs/platform-express/multer";
import { FileManagementService } from "../file-management/file-management.service";
import { ImageService } from "./image.service";
const md5 = require("md5");

@Controller()
export class ImageController {
    constructor(
        private fileManagementService: FileManagementService,
        private imageService: ImageService
    ) {}

    @Post("api/image")
    @UseInterceptors(FilesInterceptor("files"))
    async upload(@UploadedFiles() files: Express.Multer.File[], @Res() res) {
        return Promise.all(
            files.map(async (file) => {
                const imageDataHash = md5(file.buffer);
                const foundImage = await this.imageService.getByDataHash(
                    imageDataHash
                );
                if (foundImage) {
                    return res.status(HttpStatus.SEE_OTHER).json({
                        message: "imageAlreadyExists",
                        image: foundImage,
                    });
                }
                return await this.fileManagementService.upload(file);
            })
        );
    }
}
