/// <reference types="cypress" />

import personality from "../../fixtures/personality";
import { oprah, oprahWikidataId } from "../../fixtures/wikidata";

/**
 * Admin edit of a personality's stored name and description, the relink rule,
 * the creation rule and unmatched names.
 *
 * Cypress runs specs alphabetically, so this one runs after personality.cy.ts
 * (Oprah Winfrey exists) and verificationRequest.cy.ts (a request exists for
 * the unmatched-name case). The server calls the Wikimedia mock
 * (cypress/plugins/wikimediaMock.ts). cy.login() signs in as the seeded
 * test-cypress user, an admin.
 */
const personalityUrl = `/personality/${personality.slug}`;
const adminText = "Apresentadora (texto da equipe)";

describe("Admin edits a personality", () => {
    beforeEach(() => {
        cy.task("wikimediaMockReset");
        cy.task("clearWikidataCache", oprahWikidataId);
        cy.login();
    });

    after(() => {
        cy.task("wikimediaMockReset");
        cy.task("clearWikidataCache", oprahWikidataId);
    });

    it("shows the admin's text when the Wikidata item is deleted", () => {
        cy.task("wikimediaMockDeleteItem", oprahWikidataId);
        cy.visit(personalityUrl);
        cy.get("[data-cy=personalityEditButton]").click();
        cy.get("[data-cy=personalityEditWikidataStatus]").should(
            "contain",
            "Item do Wikidata: excluído"
        );
        cy.get("[data-cy=personalityEditDescription]").clear().type(adminText);
        cy.get("[data-cy=personalityEditSave]").click();
        cy.location("pathname").should("eq", personalityUrl);
        cy.contains(adminText).should("exist");
    });

    it("keeps Wikidata's text when the item is valid", () => {
        cy.visit(personalityUrl);
        cy.contains(oprah.description.pt).should("exist");
        cy.contains(adminText).should("not.exist");
    });

    it("rejects a relink to a wrong-type item", () => {
        cy.task("wikimediaMockSetItem", {
            id: "Q101352",
            label: { pt: "Winfrey", en: "Winfrey" },
            instanceOf: ["Q101352"],
        });
        cy.visit(personalityUrl);
        cy.get("[data-cy=personalityEditButton]").click();
        cy.get("[data-cy=personalityEditWikidata]").clear().type("Q101352");
        cy.get("[data-cy=personalityEditSave]").click();
        cy.contains(
            "Esse item do Wikidata não é uma pessoa, empresa, jornal ou governo"
        ).should("exist");
    });

    it("refuses to create a personality from a deleted item", () => {
        cy.task("wikimediaMockSetItem", {
            id: "Q99000002",
            label: { pt: "Pessoa Excluída" },
            instanceOf: ["Q5"],
        });
        cy.task("wikimediaMockDeleteItem", "Q99000002");
        cy.request({
            method: "POST",
            url: "/api/personality",
            body: { wikidata: "Q99000002" },
            failOnStatusCode: false,
        })
            .its("status")
            .should("eq", 400);
    });
});

describe("Fact-checker resolves an unmatched name", () => {
    it("dismisses the name", () => {
        cy.login();
        cy.task<string>("seedUnmatchedPersonality", "Oprah W.").then((id) => {
            cy.request({
                method: "PUT",
                url: `/api/verification-request/${id}/personalities`,
                body: { action: "dismiss", name: "Oprah W." },
            })
                .its("body.unmatchedPersonalities")
                .should("have.length", 0);
        });
    });
});
