export interface Cop30Filter {
    id: string;
    translationKey: string;
    wikidataId: string | null;
}

const cop30FilterMap = {
    all: null,
    cop30Conference: "Q115323194",
    deforestation: "Q5251680",
    climateFinancing: "Q113141562",
    emissions: "Q106358009",
    blueAmazon: "Q131583389",
    energy: "Q731859",
    environment: "Q43619",
    infrastructure: "Q121359",
};

const cop30Filters: Cop30Filter[] = Object.entries(cop30FilterMap).map(
    ([id, wikidataId]) => ({
        id,
        wikidataId,
        translationKey: `cop30:${id}`,
    })
);

export const allCop30WikiDataIds = cop30Filters
    .filter((filter) => filter.wikidataId !== null)
    .map((filter) => filter.wikidataId);

export default cop30Filters;
