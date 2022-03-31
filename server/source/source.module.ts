import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Source, SourceSchema } from "./schemas/source.schema";
import { SourceController } from "./source.controller";
import { SourceService } from "./source.service";

const SourceModel = MongooseModule.forFeature([
    {
        name: Source.name,
        schema: SourceSchema,
    },
]);

@Module({
    imports: [SourceModel],
    providers: [SourceService],
    exports: [SourceService],
    controllers: [SourceController],
})
export class SourceModule {}
