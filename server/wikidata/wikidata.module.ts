import { Module } from "@nestjs/common";
import { WikidataService } from "./wikidata.service";
import { MongooseModule } from "@nestjs/mongoose";
import { WikidataCache, WikidataCacheSchema } from "./schemas/wikidata.schema";

const WikidataCacheModel = MongooseModule.forFeatureAsync([
    {
        name: WikidataCache.name,
        useFactory: () => {
            const wikidataCacheSchema = WikidataCacheSchema;
            wikidataCacheSchema.index(
                { wikidataId: 1, language: 1 },
                { unique: true }
            );
            wikidataCacheSchema.index(
                { createdAt: 1 },
                { expireAfterSeconds: 86400 }
            );
            return wikidataCacheSchema;
        },
    },
]);

@Module({
    imports: [WikidataCacheModel],
    exports: [WikidataService],
    providers: [WikidataService],
})
export class WikidataModule {}
