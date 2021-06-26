import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Source, SourceSchema } from "./schemas/source.schema";

const SourceModel = MongooseModule.forFeatureAsync([
    {
        name: Source.name,
        useFactory: () => SourceSchema,
    },
]);

@Module({
    imports: [SourceModel],
})
export class SourceModule {}
