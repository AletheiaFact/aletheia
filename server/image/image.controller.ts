import { Controller, Post, UseInterceptors } from "@nestjs/common";
import {
    Req,
    UploadedFiles,
} from "@nestjs/common/decorators/http/route-params.decorator";
import { FilesInterceptor } from "@nestjs/platform-express/multer";
import { FileManagementService } from "../file-management/file-management.service";

@Controller()
export class ImageController {
    constructor(private fileManagementService: FileManagementService) {}

    @Post("api/image")
    @UseInterceptors(FilesInterceptor("files"))
    async upload(@UploadedFiles() files: Express.Multer.File[], @Req() req) {
        return Promise.all(
            files.map(async (file) => {
                return await this.fileManagementService.upload(file);
            })
        );
    }
}
