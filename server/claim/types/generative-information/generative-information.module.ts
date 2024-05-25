import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
    GenerativeInformation,
    GenerativeInformationSchema,
} from "./schemas/generative-information.schema";
import { GenerativeInformationService } from "./generative-information.service";

const GenerativeInformationModel = MongooseModule.forFeature([
    {
        name: GenerativeInformation.name,
        schema: GenerativeInformationSchema,
    },
]);

@Module({
    imports: [GenerativeInformationModel],
    providers: [GenerativeInformationService],
    exports: [GenerativeInformationService],
})
export class GenerativeInformationModule {}
