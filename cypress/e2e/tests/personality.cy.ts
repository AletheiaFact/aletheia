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
            personality.name
        );
        cy.get(`${locators.personality.SELECT_PERSONALITY}`).click();
    });

    it("Should create a Claim", () => {
        cy.get(locators.personality.BTN_SEE_MORE_PERSONALITY)
            .should("be.visible")
            .click();
        cy.get(`${locators.personality.SELECT_PERSONALITY}`)
            .should("be.visible")
            .click();
        cy.url().should(
            "contains",
            `http://localhost:3000/personality/${personality.slug}`
        );

        cy.get(locators.floatButton.FLOAT_BUTTON).should("be.visible").click();
        cy.get(locators.floatButton.ADD_CLAIM).should("be.visible").click();
        cy.get(locators.claim.BTN_ADD_SPEECH).should("be.visible").click();

        cy.get(locators.claim.BTN_SELECT_PERSONALITY)
            .should("be.visible")
            .click();

        cy.get(locators.claim.INPUT_TITLE)
            .should("be.visible")
            .type(claim.title);

        cy.get("[data-cy=testContentClaim]")
            .should("be.visible")
            .type(claim.content);

        cy.get(locators.claim.INPUT_DATA).should("be.visible").click();
        cy.get(locators.claim.INPUT_DATA_TODAY)
            .contains("Today")
            .should("be.visible")
            .click();

        cy.get(locators.claim.INPUT_SOURCE)
            .should("be.visible")
            .type(claim.source);

        cy.get("[data-cy=testCheckboxAcceptTerms]").click();

        cy.checkRecaptcha();
        cy.get(locators.claim.BTN_SUBMIT_CLAIM).click();
        cy.url().should(
            "contains",
            `http://localhost:3000/personality/${personality.slug}/claim/${claim.slug}`
        );
    });

    it.skip("should create an image claim with a personality", () => {
        cy.get(locators.floatButton.FLOAT_BUTTON).should("be.visible").click();
        cy.get(locators.floatButton.ADD_CLAIM).should("be.visible").click();
        cy.get(locators.claim.BTN_ADD_IMAGE).should("be.visible").click();
        cy.get(locators.personality.INPUT_SEARCH_PERSONALITY).type(
            personality.name
        );
        cy.get(`${locators.personality.SELECT_PERSONALITY}`).click();
        cy.get(locators.claim.BTN_SELECT_PERSONALITY)
            .should("be.visible")
            .click();
        cy.get(locators.claim.INPUT_TITLE)
            .should("be.visible")
            .type(claim.imageTitle);
        cy.get(locators.claim.INPUT_DATA).should("be.visible").click();
        cy.get(locators.claim.INPUT_DATA_TODAY)
            .contains("Today")
            .should("be.visible")
            .click();
        cy.get(locators.claim.INPUT_SOURCE)
            .should("be.visible")
            .type(claim.source);
        cy.get(locators.claim.BTN_UPLOAD_IMAGE).should("be.visible");
        cy.get('input[type="file"]').selectFile(claim.imagePersonalitySource, {
            force: true,
        });
        cy.get("[data-cy=testCheckboxAcceptTerms]").click();

        cy.checkRecaptcha();
        cy.get(locators.claim.BTN_SUBMIT_CLAIM).should("be.visible").click();
        // TODO: should we really try to submit images here?
        cy.title().should("contain", claim.imageTitle);
    });
});
