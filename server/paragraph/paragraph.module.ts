import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Paragraph, ParagraphSchema } from "./schemas/paragraph.schema";
import { ParagraphService } from "./paragraph.service";

const ParagraphModel = MongooseModule.forFeature([
    {
        name: Paragraph.name,
        schema: ParagraphSchema,
    },
]);

@Module({
    imports: [ParagraphModel],
    providers: [ParagraphService],
    exports: [ParagraphService],
})
export class ParagraphModule {}
