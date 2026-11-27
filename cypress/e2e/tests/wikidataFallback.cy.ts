/// <reference types="cypress" />

import claim from "../../fixtures/claim";
import personality from "../../fixtures/personality";
import { oprah, oprahWikidataId } from "../../fixtures/wikidata";
import locators from "../../support/locators";

/**
 * A personality in our database must stay visible when its Wikidata item
 * changes or Wikidata fails. Before, any of these hid the personality and
 * every claim and report page under it (404).
 *
 * The server calls the Wikimedia mock (cypress/plugins/wikimediaMock.ts), so
 * each case changes what the mock answers for Oprah's item, clears the
 * server's cache entry for it, and loads the pages. Depends on
 * personality.cy.ts, which creates Oprah Winfrey and the speech claim.
 */

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
    // Clicking a sentence opens the review drawer; its "see full page"
    // button links to the report page. Load that page from the server: the
    // server looks the personality up again there, which used to 404.
    cy.get("[data-cy=frase1]").click();
    cy.get(locators.claim.BTN_SEE_FULL_REVIEW)
        .should("have.attr", "href")
        .and("contain", `${claimUrl}/sentence/`)
        .then((reportUrl) => {
            // cy.visit fails on a 4xx/5xx answer; a redirect to /404 fails
            // the pathname check.
            cy.visit(String(reportUrl));
            cy.location("pathname").should("contain", `${claimUrl}/sentence/`);
        });
};

const shouldListPersonality = () => {
    // No `name` filter: this checks the list itself, not the search.
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
};

describe("Personality pages when Wikidata changes or fails", () => {
    beforeEach(() => {
        cy.task("wikimediaMockReset");
        cy.task("clearWikidataCache", oprahWikidataId);
    });

    after(() => {
        // Leave the default item and a clean cache for the next specs.
        cy.task("wikimediaMockReset");
        cy.task("clearWikidataCache", oprahWikidataId);
    });

    describe("when the item is valid", () => {
        it("shows the Wikidata description, fetched from the mock", () => {
            cy.visit(personalityUrl);
            cy.contains(oprah.description.pt).should("exist");
            cy.task("wikimediaMockRequests").should((requests) => {
                expect(requests).to.deep.include({
                    api: "wikidata",
                    action: "wbgetentities",
                    target: oprahWikidataId,
                });
            });
        });
    });

    describe("when the item is not an allowed type", () => {
        // For example a personality linked by mistake to a surname item.
        const surname = "Winfrey (sobrenome)";

        beforeEach(() => {
            cy.task("wikimediaMockSetItem", {
                id: oprahWikidataId,
                label: { pt: surname, en: surname },
                instanceOf: ["Q101352"],
            });
        });

        it("still shows the personality page, without the Wikidata label", () => {
            shouldShowPersonalityPage();
            cy.contains(surname).should("not.exist");
        });

        it("still shows the claim and report pages", () => {
            shouldShowClaimAndReportPages();
        });

        it("still lists the personality", () => {
            shouldListPersonality();
        });
    });

    describe("when the item is deleted", () => {
        beforeEach(() => {
            cy.task("wikimediaMockDeleteItem", oprahWikidataId);
        });

        it("shows the personality page with the stored name", () => {
            shouldShowPersonalityPage();
        });

        it("still shows the claim and report pages", () => {
            shouldShowClaimAndReportPages();
        });
    });

    describe("when the item is merged into another", () => {
        const mergedId = "Q99000001";

        beforeEach(() => {
            cy.task("wikimediaMockSetItem", { ...oprah, id: mergedId });
            cy.task("wikimediaMockRedirect", {
                from: oprahWikidataId,
                to: mergedId,
            });
        });

        it("follows the redirect and shows the Wikidata description", () => {
            cy.visit(personalityUrl);
            cy.contains(oprah.description.pt).should("exist");
        });
    });

    (["rate-limit-page", "http-429", "error-object"] as const).forEach(
        (mode) => {
            describe(`when Wikidata fails (${mode})`, () => {
                beforeEach(() => {
                    cy.task("wikimediaMockFail", {
                        id: oprahWikidataId,
                        mode,
                    });
                });

                it("shows the pages with the stored data and caches nothing", () => {
                    shouldShowPersonalityPage();
                    shouldShowClaimAndReportPages();
                    cy.task("countWikidataCache", oprahWikidataId).should(
                        "equal",
                        0
                    );
                });
            });
        }
    );

    describe("when the item's image is deleted from Commons", () => {
        beforeEach(() => {
            cy.task("wikimediaMockSetItem", {
                ...oprah,
                image: "Deleted file.jpg",
            });
        });

        it("still shows the personality page", () => {
            shouldShowPersonalityPage();
            cy.contains(oprah.description.pt).should("exist");
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
