import {
    Controller,
    HttpStatus,
    Post,
    Redirect,
    UseInterceptors,
} from "@nestjs/common";
import {
    Res,
    UploadedFiles,
} from "@nestjs/common/decorators/http/route-params.decorator";
import { FilesInterceptor } from "@nestjs/platform-express/multer";
import { ClaimRevisionService } from "../claim-revision/claim-revision.service";
import { FileManagementService } from "./file-management.service";
import { ImageService } from "../image/image.service";
const md5 = require("md5");

@Controller()
export class FileManagementController {
    constructor(
        private fileManagementService: FileManagementService,
        private imageService: ImageService,
        private claimRevisionService: ClaimRevisionService
    ) {}

    @Post("api/image")
    @Redirect()
    @UseInterceptors(FilesInterceptor("files"))
    async upload(@UploadedFiles() files: Express.Multer.File[], @Res() res) {
        return Promise.all(
            files.map(async (file) => {
                const imageDataHash = md5(file.buffer);
                const foundImage = await this.imageService.getByDataHash(
                    imageDataHash
                );
                if (foundImage) {
                    // get revision with the same id of the found image
                    const foundRevision =
                        await this.claimRevisionService.getByContentId(
                            foundImage._id
                        );

                    return res.status(HttpStatus.SEE_OTHER).json({
                        message: "imageAlreadyExists",
                        target: `/claim/${foundRevision.claimId}`,
                    });
                }
                return await this.fileManagementService.upload(file);
            })
        );
    }
}
