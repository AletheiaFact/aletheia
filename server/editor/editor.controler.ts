import { Body, Controller, Param, Put } from "@nestjs/common";
import { EditorService } from "./editor.service";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class EditorController {
    constructor(private editorService: EditorService) {}

    @ApiTags("editor")
    @Put("api/editor/:reference")
    public async updateEditor(@Param("reference") reference, @Body() body) {
        const { editorContentObject } = body;
        return this.editorService.updateByReference(
            reference,
            editorContentObject
        );
    }
}
