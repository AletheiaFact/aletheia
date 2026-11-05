// Offline Wikidata data for e2e runs. The app calls wikidata.org from the
// server, so CI flaked whenever Wikidata was slow or rate-limited. Specs stub
// the search endpoints and seed the server's wikidata cache with these values.
import { cop28Topic, topic } from "./event";
import { fullVerificationRequest } from "./verificationRequest";

export const oprahWikidataId = "Q55800";

const oprahWikipedia = "https://{lang}.wikipedia.org/wiki/Oprah_Winfrey";

// Shape returned by WikidataService.extractProperties, keyed by language.
export const wikidataCacheProps = {
    pt: {
        name: "Oprah Winfrey",
        description: "apresentadora, atriz e empresária norte-americana",
        isAllowedProp: true,
        wikipedia: oprahWikipedia.replace("{lang}", "pt"),
        twitterAccounts: [],
    },
    en: {
        name: "Oprah Winfrey",
        description:
            "American talk show host, actress, producer, and author (born 1954)",
        isAllowedProp: true,
        wikipedia: oprahWikipedia.replace("{lang}", "en"),
        twitterAccounts: [],
    },
};

// Personality suggestion as listAll returns it after postProcess.
export const personalitySuggestions = [
    { wikidata: oprahWikidataId, ...wikidataCacheProps.pt },
];

// Topic search results as WikidataService.queryWikibaseEntities returns them.
export const topicSuggestions = [
    {
        name: topic.name,
        description: "conferência climática da ONU em Belém",
        wikidata: topic.value,
        aliases: topic.aliases,
    },
    {
        name: cop28Topic.name,
        description: "conferência climática da ONU em Dubai",
        wikidata: cop28Topic.value,
        aliases: cop28Topic.aliases,
    },
    {
        name: fullVerificationRequest.topic,
        description: "ideologia política e econômica",
        wikidata: "Q7272",
        aliases: ["socialista"],
    },
];
