import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EditorController } from "./editor.controler";
import { EditorService } from "./editor.service";
import { Editor, EditorSchema } from "./schema/editor.schema";

const EditorModel = MongooseModule.forFeature([
    {
        name: Editor.name,
        schema: EditorSchema,
    },
]);

@Module({
    imports: [EditorModel],
    providers: [EditorService],
    exports: [EditorService],
    controllers: [EditorController],
})
export class EditorModule {}
