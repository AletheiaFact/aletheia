import { Module } from "@nestjs/common";
import {
    WIKIDATA_CACHE_TTL_SECONDS,
    WikidataService,
} from "./wikidata.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { WikidataCache, WikidataCacheSchema } from "./schemas/wikidata.schema";
import { IndexOptions } from "mongoose";

const WikidataCacheModel = MongooseModule.forFeatureAsync([
    {
        name: WikidataCache.name,
        useFactory: () => {
            const wikidataCacheSchema = WikidataCacheSchema;

            // TODO: Fix IndexOptions type mismatch when upgrading mongoose/mongodb versions
            // The current mongoose 5.13.x with compodoc 1.1.21 has conflicting IndexOptions types
            const uniqueIndexOptions = { unique: true } as IndexOptions;
            // Changing this value needs a migration (collMod): MongoDB does not
            // update the TTL of an existing index on its own.
            const expirationIndexOptions = {
                expireAfterSeconds: WIKIDATA_CACHE_TTL_SECONDS,
            } as IndexOptions;

            wikidataCacheSchema.index(
                { wikidataId: 1, language: 1 },
                uniqueIndexOptions
            );
            wikidataCacheSchema.index({ createdAt: 1 }, expirationIndexOptions);
            return wikidataCacheSchema;
        },
    },
]);

@Module({
    imports: [WikidataCacheModel, ConfigModule],
    exports: [WikidataService],
    providers: [WikidataService],
})
export class WikidataModule {}
