export interface Cop30Filter {
    id: string;
    translationKey: string;
    wikidataId: string | null;
}

const cop30Filters: Cop30Filter[] = [
    {
        id: "all",
        translationKey: "cop30:allTopics",
        wikidataId: null,
    },
    {
        id: "cop30Conference",
        translationKey: "cop30:bannerBadge",
        wikidataId: "Q115323194",
    },
    {
        id: "deforestation",
        translationKey: "cop30:deforestation",
        wikidataId: "Q5251680",
    },
    {
        id: "climateFinancing",
        translationKey: "cop30:climateFinancing",
        wikidataId: "Q113141562",
    },
    {
        id: "emissions",
        translationKey: "cop30:emissions",
        wikidataId: "Q106358009",
    },
    {
        id: "blueAmazon",
        translationKey: "cop30:blueAmazon",
        wikidataId: "Q131583389",
    },
    {
        id: "energy",
        translationKey: "cop30:energy",
        wikidataId: "Q731859",
    },
    {
        id: "environment",
        translationKey: "cop30:environment",
        wikidataId: "Q43619",
    },
    {
        id: "infrastructure",
        translationKey: "cop30:infrastructure",
        wikidataId: "Q121359",
    },
];

export const allCop30WikiDataIds = cop30Filters
    .filter((filter) => filter.wikidataId !== null)
    .map((filter) => filter.wikidataId as string);

export default cop30Filters;
