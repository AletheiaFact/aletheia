import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Cop30Service } from "./cop30.service";
import { Cop30Controller } from "./cop30.controller";
import {
    Sentence,
    SentenceSchema,
} from "../claim/types/sentence/schemas/sentence.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Sentence.name, schema: SentenceSchema },
        ]),
    ],
    controllers: [Cop30Controller],
    providers: [Cop30Service],
})
export class Cop30Module {}
