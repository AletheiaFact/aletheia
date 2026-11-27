/// <reference types="cypress" />

import claim from "../../fixtures/claim";
import personality from "../../fixtures/personality";
import { oprahWikidataId, wikidataCacheProps } from "../../fixtures/wikidata";
import locators from "../../support/locators";

/**
 * A personality in our database must stay visible when its Wikidata item
 * changes. Before, any problem with the Wikidata data hid the personality and
 * every claim and report page under it (404).
 *
 * The server fetches Wikidata itself, so the specs put each state in the
 * server's Wikidata cache: the server reads the cache first and never calls
 * wikidata.org. Depends on personality.cy.ts, which creates Oprah Winfrey and
 * the speech claim.
 */

// What WikidataService.extractProperties returns for a deleted item:
// { id, missing: "" } has no labels, descriptions or claims.
const deletedItemProps = { twitterAccounts: [] };

// An item whose P31 (instance of) is not an allowed type, for example a
// personality linked by mistake to a surname or a town item.
const disallowedTypeProps = {
    name: "Winfrey (surname)",
    isAllowedProp: false,
    twitterAccounts: [],
};

const setOprahCache = (props: Record<string, unknown>) =>
    cy.task("setWikidataCache", {
        wikidataId: oprahWikidataId,
        propsByLanguage: { pt: props, en: props },
    });

const personalityUrl = `/personality/${personality.slug}`;
const claimUrl = `${personalityUrl}/claim/${claim.slug}`;

const shouldShowPersonalityPage = () => {
    cy.visit(personalityUrl);
    cy.title().should("contain", personality.name);
    cy.get("[data-cy=testSeeFullSpeech]").should("exist");
};

const shouldShowClaimAndReportPages = () => {
    cy.visit(claimUrl);
    cy.title().should("contain", claim.title);
    cy.get("[data-cy=frase1]").click();
    cy.url().should("contain", `${claimUrl}/sentence/`);
    cy.get(locators.claim.BTN_SEE_FULL_REVIEW).should("exist");
};

describe("Personality pages when Wikidata data changes", () => {
    after(() => {
        // Put back the regular cache for the specs that run after this one.
        cy.task("seedWikidataCache");
    });

    describe("when the Wikidata item is not an allowed type", () => {
        beforeEach(() => setOprahCache(disallowedTypeProps));

        it("still shows the personality page", () => {
            shouldShowPersonalityPage();
            cy.contains(disallowedTypeProps.name).should("not.exist");
        });

        it("still shows the claim and report pages", () => {
            shouldShowClaimAndReportPages();
        });

        it("still lists the personality", () => {
            // No `name` filter: with one, the server also searches
            // wikidata.org, which CI must not depend on.
            cy.request({
                url: "/api/personality",
                qs: { page: 0, pageSize: 50, order: "asc", language: "pt" },
            })
                .its("body.personalities")
                .should((personalities) => {
                    expect(
                        personalities.map((p: { slug: string }) => p.slug)
                    ).to.include(personality.slug);
                });
        });
    });

    describe("when the Wikidata item is deleted", () => {
        beforeEach(() => setOprahCache(deletedItemProps));

        it("shows the personality page with the stored name", () => {
            shouldShowPersonalityPage();
        });

        it("still shows the claim and report pages", () => {
            shouldShowClaimAndReportPages();
        });
    });

    describe("when the Wikidata item is valid", () => {
        beforeEach(() => setOprahCache(wikidataCacheProps.pt));

        it("shows the Wikidata description", () => {
            cy.visit(personalityUrl);
            cy.contains(wikidataCacheProps.pt.description).should("exist");
        });
    });

    describe("when the personality has no Wikidata id", () => {
        const noWikidata = {
            name: "Pessoa Sem Wikidata",
            slug: "pessoa-sem-wikidata",
            description: "Radialista sem item no Wikidata",
        };

        before(() => cy.task("seedPersonality", noWikidata));
        after(() => cy.task("removePersonality", noWikidata.slug));

        it("shows the personality page with the stored data", () => {
            cy.visit(`/personality/${noWikidata.slug}`);
            cy.title().should("contain", noWikidata.name);
            cy.contains(noWikidata.description).should("exist");
        });
    });
});
