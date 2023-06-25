import { Body, Controller, Param, Put } from "@nestjs/common";
import { EditorService } from "./editor.service";

@Controller()
export class EditorController {
    constructor(private editorService: EditorService) {}

    @Put("api/editor/:reference")
    public async updateEditor(@Param("reference") reference, @Body() body) {
        const { editorContentObject } = body;
        return this.editorService.updateByReference(
            reference,
            editorContentObject
        );
    }
}
