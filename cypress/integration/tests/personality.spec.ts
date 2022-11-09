/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locators";
import claim from "../../fixtures/claim";
import personality from "../../fixtures/personality";

describe("Create personality and claim", () => {
    beforeEach("login", () => cy.login());

    it("Should search and create a new Personality", () => {
        cy.get(locators.floatButton.FLOAT_BUTTON).should("be.visible").click();
        cy.get(locators.floatButton.ADD_PERSONALITY)
            .should("be.visible")
            .click();
        cy.get(locators.personality.INPUT_SEARCH_PERSONALITY).type(
            personality.slug
        );
        cy.get(`${locators.personality.SELECT_PERSONALITY}`, {
            timeout: 5000,
        }).click();
    });

    it("Should create a Claim", () => {
        cy.get(locators.personality.BTN_SEE_MORE_PERSONALITY)
            .should("be.visible")
            .click();
        cy.get(`${locators.personality.SELECT_PERSONALITY} > *`)
            .should("be.visible")
            .click();
        cy.url().should(
            "contains",
            `http://localhost:3000/personality/${personality.slug}`
        );

        cy.get(locators.floatButton.FLOAT_BUTTON).should("be.visible").click();
        cy.get(locators.floatButton.ADD_CLAIM).should("be.visible").click();

        cy.get(locators.claim.BTN_SELECT_PERSONALITY)
            .should("be.visible")
            .click();

        cy.get("[ data-cy=testTitleClaimForm]")
            .should("be.visible")
            .type(claim.title);

        cy.get("[data-cy=testContentClaim]")
            .should("be.visible")
            .type(claim.content);

        cy.get("[data-cy=dataAserSelecionada]").should("be.visible").click();
        cy.get("a.ant-picker-today-btn")
            .contains("Today")
            .should("be.visible")
            .click();

        cy.get("[data-cy=testSource1]").should("be.visible").type(claim.source);

        cy.get("[data-cy=testCheckboxAcceptTerms]").click();

        cy.checkRecaptcha();
        cy.get("[data-cy=testSaveButton]").click();
        cy.url().should(
            "contains",
            `http://localhost:3000/personality/${personality.slug}/claim/${claim.slug}`
        );
    });
});
