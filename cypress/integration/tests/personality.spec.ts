/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locator";

describe("Should test at the login", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/login");

        cy.title().should("contain", "AletheiaFact.org");
        cy.get(locators.LOGIN.USER).type("test@aletheiafact.org", {
            delay: 200,
        });
        cy.get(locators.LOGIN.PASSWORD)
            .should("be.visible")
            .type("TEST_USER_PASS");
        cy.get(locators.LOGIN.BTN_LOGIN).should("be.visible").click();
    });

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

        cy.get("iframe").then((iframe) => {
            const body = iframe.contents().find("body");
            cy.wrap(body).find("#recaptcha-anchor").click();
        });
        cy.get("[data-cy=testSaveButton]").click();
        cy.url().should(
            "contains",
            "http://localhost:3000/personality/beyonce/claim/cantora-e-dancarina"
        );
    });
});
