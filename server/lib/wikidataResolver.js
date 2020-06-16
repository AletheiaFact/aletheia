import React from "react";

const axios = require("axios");

module.exports = class WikidataResolver {
    async fetchProperties(params) {
        const { data } = await axios.get("https://www.wikidata.org/w/api.php", {
            params: {
                action: "wbgetentities",
                ids: encodeURIComponent(params.wikidataId),
                format: "json",
                formatversion: "2"
            }
        });
        const entities = data && data.entities;
        return this.extractProperties(
            entities && entities[params.wikidataId],
            params.language
        );
    }

    async extractProperties(wikidata, lang = "en") {
        const wikidataProps = {};
        if (!wikidata) {
            return {};
        }

        // Get label for the personality name
        wikidataProps.name = this.extractValue(wikidata, "labels", lang);

        // Get description for the personality description
        wikidataProps.description = this.extractValue(
            wikidata,
            "descriptions",
            lang
        );

        if (wikidata.claims.P31) {
            const wikidataInstanceof =
                wikidata.claims.P31[0].mainsnak.datavalue.value;
            wikidataProps.isAllowedProp = wikidataInstanceof.id === "Q5";
        } else {
            wikidataProps.isAllowedProp = false;
        }

        // Extract image if it exists
        if (wikidata.claims.P18) {
            const fileName = wikidata.claims.P18[0].mainsnak.datavalue.value;
            wikidataProps.image = await this.getCommonsThumbURL(fileName);
        }
        return wikidataProps;
    }

    extractValue(wikidata, property, lang) {
        if (!wikidata[property]) {
            return;
        }
        const langFallback =
            wikidata[property] && wikidata[property][lang] ? lang : "en";
        return (
            wikidata[property][langFallback] &&
            wikidata[property][langFallback].value
        );
    }

    queryWikibaseEntities(query, language = "en") {
        const params = {
            action: "wbsearchentities",
            search: query,
            format: "json",
            errorformat: "plaintext",
            language,
            type: "item",
            origin: "*"
        };

        return axios
            .get(`https://www.wikidata.org/w/api.php`, { params })
            .then(response => {
                const { search } = response && response.data;
                return search.map(wbentity => {
                    if (!wbentity.label) {
                        return;
                    }
                    return {
                        name: wbentity.label,
                        description: wbentity.description,
                        wikidata: wbentity.id
                    };
                });
            });
    }

    async getCommonsThumbURL(imageTitle) {
        const { data } = await axios.get(
            "https://commons.wikimedia.org/w/api.php",
            {
                params: {
                    action: "query",
                    titles: `File:${imageTitle}`,
                    prop: "imageinfo",
                    iiprop: "url",
                    iiurlwidth: 400,
                    format: "json",
                    formatversion: "2"
                }
            }
        );
        const { pages } = data && data.query;
        if (pages.length <= 0) {
            return;
        }
        const imageinfo =
            pages[0] && pages[0].imageinfo && pages[0].imageinfo[0];
        return imageinfo.url;
    }
};
