import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Speech, SpeechSchema } from "./mongo/schemas/speech.schema";
import { MongoSpeechService } from "./mongo/speech.service";
import { PostgresSpeechService } from "./postgres/speech.service";
import { speechServiceProvider } from "./speech.provider";
import dbConfig from "../../../config/db.config";
import { SpeechController } from "./speech.controller";

const SpeechModel = MongooseModule.forFeature([
    {
        name: Speech.name,
        schema: SpeechSchema,
    },
]);

@Module({})
export class SpeechModule {
    static register(): DynamicModule {
        const imports: any[] = [];
        const providers: any[] = [speechServiceProvider];

        if (dbConfig.type === "mongodb") {
            imports.push(SpeechModel);
            providers.push(MongoSpeechService);
        } else if (dbConfig.type === "postgres") {
            providers.push(PostgresSpeechService);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }

        return {
            module: SpeechModule,
            imports: [...imports],
            providers,
            exports: ["SpeechService"],
            controllers: [SpeechController],
        };
    }
}
