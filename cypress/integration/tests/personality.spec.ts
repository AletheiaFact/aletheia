/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locator";

describe("Create personality and claim", () => {
    beforeEach('login', () => { cy.login() });

    it("Should search and create a new Personality", () => {
        cy.get(locators.PERSONALITY.BTN_SEE_MORE_PERSONALITY).should('exist').click();
        cy.get(locators.PERSONALITY.BTN_ADD_PERSONALITY).click();
        cy.get(locators.PERSONALITY.INPUT_SEARCH_PERSONALITY).type("beyonce");
        cy.get("[data-cy=Beyoncé]").click();
    });

    it("Should create a Claim", () => {
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
        cy.get('table.ant-picker-content').contains('7').should("be.visible").click();

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
