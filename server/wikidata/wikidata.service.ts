import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
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

@Injectable()
export class WikidataService {
    constructor(
        @InjectModel(WikidataCache.name)
        private wikidataCache: Model<WikidataCacheDocument>
    ) {}

    async fetchProperties(params) {
        const wikidataCache = await this.wikidataCache
            .findOne({
                wikidataId: params.wikidataId,
                language: params.language,
            })
            .exec();
        if (!wikidataCache) {
            const props = await this.requestProperties(params);
            const newWikidataCache = new this.wikidataCache({
                ...params,
                props,
            });
            newWikidataCache.save();
            return props;
        }
        return wikidataCache.props;
    }

    async requestProperties(params) {
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

    async extractProperties(wikidata, language = "en"): Promise<any> {
        const wikidataProps = {
            name: undefined,
            description: undefined,
            isAllowedProp: undefined,
            image: undefined,
            wikipedia: undefined,
            avatar: undefined,
            twitterAccounts: [],
        };
        if (!wikidata) {
            return {};
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

    getSiteLinkName(language) {
        if (languageVariantMap[language]) {
            language = languageVariantMap[language];
        }
        return `${language}wiki`;
    }

    extractValue(wikidata, property, language) {
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
    ) {
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
                const { search } = response && response.data;

                return search.flatMap((wbentity) => {
                    if (!wbentity.label) {
                        return [];
                    }

                    const result: any = {
                        name: wbentity.label,
                        description: wbentity.description,
                        wikidata: wbentity.id,
                    };

                    if (includeAliases) {
                        const aliases = wbentity.aliases || [];
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

    async getCommonsThumbURL(imageTitle, imageSize) {
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
