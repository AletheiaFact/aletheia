// Offline Wikimedia data for e2e runs. The server calls Wikidata and Commons
// itself, so the browser cannot intercept those calls. The e2e config
// (config.test.ci.yaml) points the server at the mock server Cypress starts
// (cypress/plugins/wikimediaMock.ts), which answers from these items.
import { cop28Topic, topic } from "./event";
import { fullVerificationRequest } from "./verificationRequest";

export const WIKIMEDIA_MOCK_PORT = 4590;

type Lang = "pt" | "en";

export interface WikidataItemInput {
    id: string;
    label: Partial<Record<Lang, string>>;
    description?: Partial<Record<Lang, string>>;
    aliases?: Partial<Record<Lang, string[]>>;
    /** P31 (instance of) values, e.g. ["Q5"] for a human. */
    instanceOf?: string[];
    /** Commons file name for P18 (image). */
    image?: string;
    /** Wikipedia article titles by language. */
    wikipedia?: Partial<Record<Lang, string>>;
}

const languageMap = <T>(
    values: Partial<Record<Lang, T>> | undefined,
    wrap: (value: T, language: string) => unknown
) =>
    Object.fromEntries(
        Object.entries(values || {}).map(([language, value]) => [
            language,
            wrap(value as T, language),
        ])
    );

const claim = (datavalue: unknown) => ({
    mainsnak: { snaktype: "value", datavalue: { value: datavalue } },
});

/** Builds an entity in the shape `wbgetentities` (formatversion=2) returns. */
export const wikidataItem = (input: WikidataItemInput) => ({
    id: input.id,
    type: "item",
    labels: languageMap(input.label, (value, language) => ({
        language,
        value,
    })),
    descriptions: languageMap(input.description, (value, language) => ({
        language,
        value,
    })),
    aliases: languageMap(input.aliases, (values: string[], language) =>
        values.map((value) => ({ language, value }))
    ),
    sitelinks: Object.fromEntries(
        Object.entries(input.wikipedia || {}).map(([language, title]) => [
            `${language}wiki`,
            { site: `${language}wiki`, title },
        ])
    ),
    claims: {
        ...(input.instanceOf && {
            P31: input.instanceOf.map((id) => claim({ id })),
        }),
        ...(input.image && { P18: [claim(input.image)] }),
    },
});

export const oprahWikidataId = "Q55800";

export const oprah: WikidataItemInput = {
    id: oprahWikidataId,
    label: { pt: "Oprah Winfrey", en: "Oprah Winfrey" },
    description: {
        pt: "apresentadora, atriz e empresária norte-americana",
        en: "American talk show host, actress, producer, and author (born 1954)",
    },
    instanceOf: ["Q5"],
    wikipedia: { pt: "Oprah Winfrey", en: "Oprah Winfrey" },
};

// Q2020153 = academic conference; Q7257 = ideology. Neither is an allowed
// personality type, so the server drops them from personality suggestions.
const topicItems: WikidataItemInput[] = [
    {
        id: topic.value,
        label: { pt: topic.name, en: topic.name },
        description: { pt: "conferência climática da ONU em Belém" },
        aliases: { pt: topic.aliases, en: topic.aliases },
        instanceOf: ["Q2020153"],
    },
    {
        id: cop28Topic.value,
        label: { pt: cop28Topic.name, en: cop28Topic.name },
        description: { pt: "conferência climática da ONU em Dubai" },
        aliases: { pt: cop28Topic.aliases, en: cop28Topic.aliases },
        instanceOf: ["Q2020153"],
    },
    {
        id: "Q7272",
        label: {
            pt: fullVerificationRequest.topic,
            en: fullVerificationRequest.topic,
        },
        description: { pt: "ideologia política e econômica" },
        aliases: { pt: ["socialista"], en: ["socialista"] },
        instanceOf: ["Q7257"],
    },
];

/** Items the mock knows at the start of a run and after each reset. */
export const defaultWikidataItems: WikidataItemInput[] = [oprah, ...topicItems];
