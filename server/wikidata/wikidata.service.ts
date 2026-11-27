import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { z } from "zod";
import {
    WikidataCache,
    WikidataCacheDocument,
} from "./schemas/wikidata.schema";

const axios = require("axios");

const languageVariantMap: Record<string, string> = {
    "pt-br": "pt",
};

const WIKIMEDIA_HEADERS = {
    "User-Agent":
        "Aletheia/1.0 (https://github.com/AletheiaFact/aletheia; contato@aletheiafact.org)",
};

/**
 * Wikimedia can answer slowly or not at all. A personality page must not
 * wait on it for long, because the data from Wikidata is optional.
 */
const WIKIMEDIA_TIMEOUT_MS = 10000;

/**
 * The cache keeps an entry for this long (TTL index on `createdAt`, set in
 * `wikidata.module.ts`). Wikidata labels and images change slowly, and each
 * refetch counts against the Wikimedia rate limit.
 */
export const WIKIDATA_CACHE_TTL_SECONDS = 7 * 24 * 60 * 60;

/**
 * A valid `wbgetentities` answer always has an `entities` object. When
 * Wikimedia rate-limits or fails, it can send a plain-text page or an
 * `{ error }` object instead. That is not data about the entity, so it must
 * not be cached.
 */
const WbGetEntitiesResponseSchema = z.object({
    entities: z.record(z.string(), z.unknown()),
});

export class WikidataUnavailableError extends Error {
    constructor(wikidataId: string, reason: string) {
        super(`Wikidata gave no usable answer for ${wikidataId}: ${reason}`);
        this.name = "WikidataUnavailableError";
    }
}

const SUPPORTED_LANGUAGES = ["pt", "en", "pt-br"] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export interface WikidataParamsInput {
    wikidataId: string;
    language?: string;
}

export interface WikidataParams {
    wikidataId: string;
    language: SupportedLanguage;
}

export const WikidataParamsSchema = z.object({
    wikidataId: z
        .string()
        .regex(/^Q\d+$/, "WikidataId must be in format Q followed by numbers"),
    language: z
        .string()
        .optional()
        .transform((val) => {
            if (!val) return "en" as SupportedLanguage;
            return SUPPORTED_LANGUAGES.includes(val as SupportedLanguage)
                ? (val as SupportedLanguage)
                : ("en" as SupportedLanguage);
        })
        .default("en" as SupportedLanguage),
});

export interface WikidataProperties {
    name?: string;
    description?: string;
    isAllowedProp?: boolean;
    image?: string;
    wikipedia?: string;
    avatar?: string;
    twitterAccounts: string[];
}

export interface WikibaseEntity {
    name: string;
    description?: string;
    wikidata: string;
    aliases?: string[];
    matchedAlias?: string | null;
}

interface WikibaseSearchResult {
    id: string;
    label?: string;
    description?: string;
    aliases?: string[];
}

@Injectable()
export class WikidataService {
    constructor(
        @InjectModel(WikidataCache.name)
        private wikidataCache: Model<WikidataCacheDocument>
    ) {}

    /**
     * Fetches Wikidata properties from cache or API
     * @param params - Wikidata parameters (accepts flexible input)
     * @returns Wikidata properties object
     */
    async fetchProperties(
        params: WikidataParamsInput
    ): Promise<WikidataProperties> {
        const validatedParams = WikidataParamsSchema.parse(
            params
        ) as WikidataParams;

        const wikidataCache = await this.wikidataCache
            .findOne({
                wikidataId: validatedParams.wikidataId,
                language: validatedParams.language,
            })
            .exec();

        if (!wikidataCache) {
            // Throws WikidataUnavailableError when Wikimedia does not answer
            // with entity data, so a failed request is never cached.
            const props = await this.requestProperties(validatedParams);
            await this.wikidataCache.findOneAndUpdate(
                {
                    wikidataId: validatedParams.wikidataId,
                    language: validatedParams.language,
                },
                { $setOnInsert: { ...validatedParams, props } },
                { upsert: true }
            );
            return props;
        }

        return wikidataCache.props as WikidataProperties;
    }

    /**
     * Requests Wikidata properties from the Wikidata API
     * @param params - Validated Wikidata parameters
     * @returns Wikidata properties object
     */
    async requestProperties(
        params: WikidataParams
    ): Promise<WikidataProperties> {
        const data = await this.wikimediaGet(
            "https://www.wikidata.org/w/api.php",
            {
                action: "wbgetentities",
                ids: params.wikidataId,
                format: "json",
                formatversion: "2",
            }
        );
        const parsed = WbGetEntitiesResponseSchema.safeParse(data);
        if (!parsed.success) {
            throw new WikidataUnavailableError(
                params.wikidataId,
                "response has no entities"
            );
        }
        return this.extractProperties(
            this.pickEntity(parsed.data.entities, params.wikidataId),
            params.language
        );
    }

    /**
     * Wikidata follows a redirect (a merged item) and keys the answer by the
     * target id, not by the id we asked for. We ask for one id, so the only
     * entity in the answer is the one we want.
     */
    private pickEntity(
        entities: Record<string, unknown>,
        wikidataId: string
    ): unknown {
        if (entities[wikidataId]) {
            return entities[wikidataId];
        }
        const values = Object.values(entities);
        return values.length === 1 ? values[0] : undefined;
    }

    /**
     * Single exit point for HTTP calls to Wikimedia, so tests can stub it.
     */
    protected async wikimediaGet(
        url: string,
        params: Record<string, string | number>
    ): Promise<unknown> {
        const { data } = await axios.get(url, {
            params,
            headers: WIKIMEDIA_HEADERS,
            timeout: WIKIMEDIA_TIMEOUT_MS,
        });
        return data;
    }

    /**
     * Extracts properties from Wikidata entity response
     * @param wikidata - Wikidata entity object (can be any structure)
     * @param language - Language code for labels and descriptions
     * @returns Extracted Wikidata properties
     */
    async extractProperties(
        wikidata: any,
        language: string = "en"
    ): Promise<WikidataProperties> {
        const wikidataProps: WikidataProperties = {
            name: undefined,
            description: undefined,
            isAllowedProp: undefined,
            image: undefined,
            wikipedia: undefined,
            avatar: undefined,
            twitterAccounts: [],
        };
        // A deleted item comes back as { id, missing: "" }: there is nothing
        // to extract, and no reason to hide a personality we already have.
        if (!wikidata || wikidata.missing !== undefined) {
            return wikidataProps;
        }

        // Get label for the personality name
        wikidataProps.name = this.extractValue(wikidata, "labels", language);

        // Get description for the personality description
        wikidataProps.description = this.extractValue(
            wikidata,
            "descriptions",
            language
        );

        const siteLinkName = this.getSiteLinkName(language);

        if (wikidata?.sitelinks && wikidata?.sitelinks[siteLinkName]) {
            const wikiLang = siteLinkName.match(/^(.*)wiki$/)?.[1];
            const wikiTitle = wikidata.sitelinks[siteLinkName].title;
            if (wikiLang && wikiTitle) {
                wikidataProps.wikipedia = `https://${wikiLang.replace(
                    "_",
                    "-"
                )}.wikipedia.org/wiki/${encodeURI(wikiTitle)}`;
            }
        }

        if (!wikidata.claims) {
            return wikidataProps;
        }

        /**
         * Q5 = Human
         * Q891723 = Public Companies
         * Q1153191 = Online newspaper
         * Q7188 = Government
         */
        const allowedInstances = ["Q5", "Q891723", "Q1153191", "Q7188"];
        /**
         * Relation of type constraints
         * https://www.wikidata.org/wiki/Q21503252
         */
        const hasP31Claims =
            wikidata.claims?.P31 && wikidata.claims?.P31?.length > 0;
        if (hasP31Claims) {
            // "no value" and "unknown value" claims have no datavalue.
            const isAllowedProp = wikidata.claims.P31.some((claim: any) =>
                allowedInstances.includes(claim?.mainsnak?.datavalue?.value?.id)
            );

            wikidataProps.isAllowedProp = isAllowedProp;
        } else {
            wikidataProps.isAllowedProp = false;
        }

        // Extract image if it exists
        const wikidataPropImage = wikidata.claims?.P18 || wikidata.claims?.P154;
        const fileName = wikidataPropImage?.[0]?.mainsnak?.datavalue?.value;
        if (typeof fileName === "string") {
            wikidataProps.image = await this.getCommonsThumbURL(fileName, 400);
            wikidataProps.avatar = await this.getCommonsThumbURL(fileName, 100);
        }
        // Extract Twitter accounts if they exist
        if (Array.isArray(wikidata.claims.P2002)) {
            wikidata.claims.P2002.forEach((claim: any) => {
                const twitterAccount = claim?.mainsnak?.datavalue?.value;
                if (typeof twitterAccount === "string") {
                    wikidataProps.twitterAccounts.push(twitterAccount);
                }
            });
        }

        return wikidataProps;
    }

    /**
     * Gets the site link name for Wikipedia based on language
     * @param language - Language code
     * @returns Wiki site link name (e.g., 'ptwiki', 'enwiki')
     */
    getSiteLinkName(language: string): string {
        if (languageVariantMap[language]) {
            language = languageVariantMap[language];
        }
        return `${language}wiki`;
    }

    /**
     * Extracts a value from Wikidata entity for a specific property and language
     * @param wikidata - Wikidata entity object
     * @param property - Property name to extract (e.g., 'labels', 'descriptions')
     * @param language - Language code
     * @returns Extracted value or undefined
     */
    extractValue(
        wikidata: any,
        property: string,
        language: string
    ): string | undefined {
        if (!wikidata[property]) {
            return;
        }
        const languageFallback =
            wikidata[property] && wikidata[property][language]
                ? language
                : "en";
        return (
            wikidata[property][languageFallback] &&
            wikidata[property][languageFallback].value
        );
    }

    queryWikibaseEntities(
        query: string,
        language: string = "en",
        includeAliases: boolean = true
    ): Promise<WikibaseEntity[]> {
        const params = {
            action: "wbsearchentities",
            search: query,
            format: "json",
            errorformat: "plaintext",
            uselang: language,
            language,
            type: "item",
            origin: "*",
        };

        return axios
            .get(`https://www.wikidata.org/w/api.php`, {
                params,
                headers: WIKIMEDIA_HEADERS,
            })
            .then((response: any) => {
                const { search }: { search: WikibaseSearchResult[] } =
                    response && response.data;

                return search.flatMap((searchResult: WikibaseSearchResult) => {
                    if (!searchResult.label) {
                        return [];
                    }

                    const result: WikibaseEntity = {
                        name: searchResult.label,
                        description: searchResult.description,
                        wikidata: searchResult.id,
                    };

                    if (includeAliases) {
                        const aliases = searchResult.aliases || [];
                        const matchedAlias = aliases.find((alias) =>
                            alias.toLowerCase().includes(query.toLowerCase())
                        );
                        result.aliases = aliases;
                        result.matchedAlias = matchedAlias || null;
                    }

                    return [result];
                });
            });
    }

    /**
     * Gets the thumbnail URL from Wikimedia Commons. A deleted file gives
     * undefined. A failed request throws, so the caller does not cache a
     * result that is only missing its image because Commons was down.
     * @param imageTitle - Title of the image on Commons
     * @param imageSize - Desired image width in pixels
     * @returns Thumbnail URL or undefined
     */
    async getCommonsThumbURL(
        imageTitle: string,
        imageSize: number
    ): Promise<string | undefined> {
        const data: any = await this.wikimediaGet(
            "https://commons.wikimedia.org/w/api.php",
            {
                action: "query",
                titles: `File:${imageTitle}`,
                prop: "imageinfo",
                iiprop: "url",
                iiurlwidth: imageSize,
                format: "json",
                formatversion: "2",
            }
        );
        const thumburl = data?.query?.pages?.[0]?.imageinfo?.[0]?.thumburl;
        return typeof thumburl === "string" ? thumburl : undefined;
    }
}
