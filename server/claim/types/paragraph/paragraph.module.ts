import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Paragraph, ParagraphSchema } from "./mongo/schemas/paragraph.schema";
import { MongoParagraphService } from "./mongo/paragraph.service";
import { PostgresParagraphService } from "./postgres/paragraph.service";
import { paragraphServiceProvider } from "./paragraph.provider";
import dbConfig from "../../../config/db.config";

const ParagraphModel = MongooseModule.forFeature([
    {
        name: Paragraph.name,
        schema: ParagraphSchema,
    },
]);

@Module({})
export class ParagraphModule {
    static register(): DynamicModule {
        const imports: any[] = [];
        const providers: any[] = [paragraphServiceProvider];

        if (dbConfig.type === "mongodb") {
            imports.push(ParagraphModel);
            providers.push(MongoParagraphService);
        } else if (dbConfig.type === "postgres") {
            providers.push(PostgresParagraphService);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }

        return {
            module: ParagraphModule,
            imports: [...imports],
            providers,
            exports: ["ParagraphService"],
        };
    }
}
