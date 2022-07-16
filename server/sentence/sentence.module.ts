import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Sentence, SentenceSchema } from "./schemas/sentence.schema";
import { SentenceService } from "./sentence.service";

const SentenceModel = MongooseModule.forFeature([
    {
        name: Sentence.name,
        schema: SentenceSchema,
    },
]);

@Module({
    imports: [SentenceModel],
    providers: [SentenceService],
    exports: [SentenceService],
})
export class SentenceModule {}
