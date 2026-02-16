import { Body, Controller, Param, Put } from "@nestjs/common";
import { EditorService } from "./editor.service";
import { ApiTags } from "@nestjs/swagger";
import { UpdateWriteOpResult } from "mongoose";

@Controller()
export class EditorController {
    constructor(private editorService: EditorService) {}

    @ApiTags("editor")
    @Put("api/editor/:reference")
    public async updateEditor(
        @Param("reference") reference,
        @Body() body
    ): Promise<UpdateWriteOpResult> {
        const { editorContentObject } = body;
        return this.editorService.updateByReference(
            reference,
            editorContentObject
        );
    }
}
