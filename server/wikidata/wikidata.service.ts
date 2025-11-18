import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { z } from "zod";
import {
    WikidataCache,
    WikidataCacheDocument,
} from "./schemas/wikidata.schema";

const axios = require("axios");

const languageVariantMap = {
    "pt-br": "pt",
};

const WIKIMEDIA_HEADERS = {
    "User-Agent":
        "Aletheia/1.0 (https://github.com/AletheiaFact/aletheia; contato@aletheiafact.org)",
};

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
            const props = await this.requestProperties(validatedParams);
            if (props.isAllowedProp === false) {
                return props;
            }
            const newWikidataCache = new this.wikidataCache({
                ...validatedParams,
                props,
            });
            await newWikidataCache.save();
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
        const { data } = await axios.get("https://www.wikidata.org/w/api.php", {
            params: {
                action: "wbgetentities",
                ids: encodeURIComponent(params.wikidataId),
                format: "json",
                formatversion: "2",
            },
            headers: WIKIMEDIA_HEADERS,
        });
        const entities = data && data.entities;
        return this.extractProperties(
            entities && entities[params.wikidataId],
            params.language
        );
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
        if (!wikidata) {
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
            const wikiLang = siteLinkName.match(/^(.*)wiki$/)[1];
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
         */
        const allowedInstances = ["Q5", "Q891723", "Q1153191"];
        /**
         * Relation of type constraints
         * https://www.wikidata.org/wiki/Q21503252
         */
        const hasP31Claims =
            wikidata.claims?.P31 && wikidata.claims?.P31?.length > 0;
        if (hasP31Claims) {
            const isAllowedProp = wikidata.claims?.P31?.some((claim) => {
                const instance = claim.mainsnak.datavalue.value;
                return allowedInstances.includes(instance.id);
            });

            wikidataProps.isAllowedProp = isAllowedProp;
        } else {
            wikidataProps.isAllowedProp = false;
        }

        // Extract image if it exists
        const wikidataPropImage = wikidata.claims?.P18 || wikidata.claims?.P154;
        if (wikidataPropImage) {
            const fileName = wikidataPropImage[0].mainsnak.datavalue.value;
            wikidataProps.image = await this.getCommonsThumbURL(fileName, 400);
            wikidataProps.avatar = await this.getCommonsThumbURL(fileName, 100);
        }
        // Extract Twitter accounts if they exist
        if (wikidata?.claims?.P2002) {
            wikidata.claims.P2002.forEach((claim) => {
                const twitterAccount = claim.mainsnak.datavalue.value;
                wikidataProps.twitterAccounts.push(twitterAccount);
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
            .then((response) => {
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
     * Gets the thumbnail URL from Wikimedia Commons
     * @param imageTitle - Title of the image on Commons
     * @param imageSize - Desired image width in pixels
     * @returns Thumbnail URL or undefined
     */
    async getCommonsThumbURL(
        imageTitle: string,
        imageSize: number
    ): Promise<string | undefined> {
        const { data } = await axios.get(
            "https://commons.wikimedia.org/w/api.php",
            {
                params: {
                    action: "query",
                    titles: `File:${imageTitle}`,
                    prop: "imageinfo",
                    iiprop: "url",
                    iiurlwidth: imageSize,
                    format: "json",
                    formatversion: "2",
                },
                headers: WIKIMEDIA_HEADERS,
            }
        );
        const { pages } = data && data.query;
        if (pages.length <= 0) {
            return;
        }
        const imageinfo =
            pages[0] && pages[0].imageinfo && pages[0].imageinfo[0];
        return imageinfo.thumburl;
    }
}
