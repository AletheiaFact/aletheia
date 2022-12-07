import { Module } from "@nestjs/common";
import { ImageModule } from "../image/image.module";
import { ClaimRevisionModule } from "../claim-revision/claim-revision.module";
import { FileManagementController } from "./file-management.controller";
import { FileManagementService } from "./file-management.service";

@Module({
    imports: [ClaimRevisionModule, ImageModule],
    exports: [FileManagementService],
    providers: [FileManagementService],
    controllers: [FileManagementController],
})
export class FileManagementModule {}
