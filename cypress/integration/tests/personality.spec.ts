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
        cy.get(locators.LOGIN.PASSWORD).type("TEST_USER_PASS");
        cy.get(locators.LOGIN.BTN_LOGIN).click();
    });

    it("Go personality and search new personality", () => {
        cy.get(locators.PERSONALITY.BTN_SEE_MORE_PERSONALITY).click();
        cy.get(locators.PERSONALITY.BTN_ADD_PERSONALITY).click();
        cy.get(locators.PERSONALITY.INPUT_SEARCH_PERSONALITY).type("beyonce")
        cy.get("[data-cy=testBackButton]").click();
        cy.visit("http://localhost:3000/home");
    });
});
