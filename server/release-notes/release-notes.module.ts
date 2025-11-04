import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ReleaseNotesController } from "./release-notes.controller";
import { ReleaseNotesService } from "./release-notes.service";
import { ViewModule } from "../view/view.module";

@Module({
    imports: [HttpModule, ViewModule],
    controllers: [ReleaseNotesController],
    providers: [ReleaseNotesService],
    exports: [ReleaseNotesService],
})
export class ReleaseNotesModule {}
