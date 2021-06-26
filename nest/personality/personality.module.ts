import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Personality, PersonalitySchema } from "./schemas/personality.schema";

const PersonalityModel = MongooseModule.forFeatureAsync([
    {
        name: Personality.name,
        useFactory: () => PersonalitySchema,
    },
]);

@Module({
    imports: [PersonalityModel],
})
export class PersonalityModule {}
