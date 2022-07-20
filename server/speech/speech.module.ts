import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Speech, SpeechSchema } from "./schemas/speech.schema";
import { SpeechService } from "./speech.service";

const SpeechModel = MongooseModule.forFeature([
    {
        name: Speech.name,
        schema: SpeechSchema,
    },
]);

@Module({
    imports: [SpeechModel],
    providers: [SpeechService],
    exports: [SpeechService],
})
export class SpeechModule {}
