/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locator";

describe("Should test at the login", () => {
    beforeEach('login', () => { cy.login() });

    it("Go personality and search new personality", () => {
        cy.get(locators.PERSONALITY.BTN_SEE_MORE_PERSONALITY).click();
        cy.get(locators.PERSONALITY.BTN_ADD_PERSONALITY).click();
        cy.get(locators.PERSONALITY.INPUT_SEARCH_PERSONALITY).type("beyonce");
        cy.get("[data-cy=Beyoncé]").click();
    });

    it("Claim", () => {
        cy.get(locators.PERSONALITY.BTN_SEE_MORE_PERSONALITY)
            .should("be.visible")
            .click();
        cy.get("[data-cy=Beyoncé] > *").should("be.visible").click();
        cy.url().should(
            "contains",
            "http://localhost:3000/personality/beyonce"
        );

        cy.get("[data-cy=testButtonAddClaim] > .anticon")
            .should("be.visible")
            .click();

        cy.get("[ data-cy=testTitleClaimForm]")
            .should("be.visible")
            .type("Cantora e Dançarina?");

        cy.get("[data-cy=testContentClaim]")
            .should("be.visible")
            .type("Ele é uma ótima dançarina e cantora");

        cy.get("[data-cy=dataAserSelecionada]").should("be.visible").click();
        cy.contains(7).click();

        cy.get("[data-cy=testSource1]")
            .should("be.visible")
            .type("http://wikipedia.org");

        cy.get("[data-cy=testCheckboxAcceptTerms]").click();

        cy.checkRecaptcha()
        cy.get("[data-cy=testSaveButton]").click();
        cy.url().should(
            "contains",
            "http://localhost:3000/personality/beyonce/claim/cantora-e-dancarina"
        );
    });
});
