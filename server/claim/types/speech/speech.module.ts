import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Speech, SpeechSchema } from "./schemas/speech.schema";
import { SpeechController } from "./speech.controller";
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
    controllers: [SpeechController],
})
export class SpeechModule {}
