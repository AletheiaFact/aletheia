const axios = require("axios");

module.exports = class WikidataResolver {
    async fetchProperties(params) {
        console.log(params);
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
        console.log(lang);
        // Get label for the personality name
        wikidataProps.name =
            wikidata.labels &&
            wikidata.labels[lang] &&
            wikidata.labels[lang].value;

        // Get description for the personality description
        wikidataProps.description =
            wikidata.descriptions &&
            wikidata.descriptions[lang] &&
            wikidata.descriptions[lang].value;

        // Extract image if it exists
        if (wikidata.claims.P18) {
            const fileName = wikidata.claims.P18[0].mainsnak.datavalue.value;
            wikidataProps.image = await this.getCommonsThumbURL(fileName);
        }
        return wikidataProps;
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
