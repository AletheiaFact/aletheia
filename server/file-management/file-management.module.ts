import { Module } from "@nestjs/common";
import { FileManagementService } from "./file-management.service";

@Module({
    exports: [FileManagementService],
    providers: [FileManagementService],
})
export class FileManagementModule {}
