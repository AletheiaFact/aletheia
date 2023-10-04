import { EditorParseService } from "./editor-parse.service";
import { Module } from "@nestjs/common";

@Module({
    exports: [EditorParseService],
    providers: [EditorParseService],
})
export class EditorParseModule {}
