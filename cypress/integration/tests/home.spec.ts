/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locator";

describe("Test the side menu routes", () => {
    it("Open side bar and Login", () => {
        cy.visit("http://localhost:3000/home");

        cy.title().should("contain", "AletheiaFact.org");
        cy.get("#rcc-confirm-button").click();

        cy.get(locators.MENU.SIDE_MENU).click();
        cy.get("[data-cy=testMyAccountItem]").click();
        cy.get(locators.LOGIN.USER).type("test@aletheiafact.org");
        cy.get(locators.LOGIN.PASSWORD).type("TEST_USER_PASS");
        cy.get(locators.LOGIN.BTN_LOGIN).click();
    });

    it("Open side bar and click about", () => {
        cy.get(locators.MENU.SIDE_MENU).click();
        cy.get("[data-cy=testAboutItem]").click();
    });

    it("Open side bar and click privacy policy", () => {
        cy.get(locators.MENU.SIDE_MENU).click();
        cy.get("[data-cy=testPrivacyPolicyItem]").click();
    });

    it("Open side bar and click code of conduct", () => {
        cy.get(locators.MENU.SIDE_MENU).click();
        cy.get("[data-cy=testCodeOfConductItem]").should("contain", "Condu");
        cy.get("[data-cy=testCodeOfConductItem]").click();
    });
});
