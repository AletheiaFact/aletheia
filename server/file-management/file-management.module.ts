import { Module } from "@nestjs/common";
import { ImageModule } from "../image/image.module";
import { ClaimRevisionModule } from "../claim-revision/claim-revision.module";
import { FileManagementController } from "./file-management.controller";
import { FileManagementService } from "./file-management.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ClaimRevisionModule, ImageModule, ConfigModule],
    exports: [FileManagementService],
    providers: [FileManagementService],
    controllers: [FileManagementController],
})
export class FileManagementModule {}
