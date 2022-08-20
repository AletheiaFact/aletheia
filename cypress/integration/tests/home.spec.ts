/* eslint-disable no-undef */
/// <reference types="cypress" />

import user from "../../fixtures/user";
import locators from "../../support/locators";

describe("Test the side menu routes", () => {
    it("Open side bar and Login", () => {
        cy.visit("http://localhost:3000");

        cy.title().should("contain", "AletheiaFact.org");
        cy.get("#rcc-confirm-button").click();

        cy.get(locators.menu.SIDE_MENU).click();
        cy.get("[data-cy=testMyAccountItem]").click();
        cy.get(locators.login.USER).type(user.email);
        cy.get(locators.login.PASSWORD).type(user.password);
        cy.get(locators.login.BTN_LOGIN).click();
    });

    it("Open side bar and click about", () => {
        cy.get(locators.menu.SIDE_MENU).click();
        cy.get("[data-cy=testAboutItem]").click();
    });

    it("Open side bar and click privacy policy", () => {
        cy.get(locators.menu.SIDE_MENU).click();
        cy.get("[data-cy=testPrivacyPolicyItem]").click();
    });

    it("Open side bar and click code of conduct", () => {
        cy.get(locators.menu.SIDE_MENU).click();
        cy.get("[data-cy=testCodeOfConductItem]").should("contain", "Condu");
        cy.get("[data-cy=testCodeOfConductItem]").click();
    });

    it("Should not show log out when not logged in", () => {
        cy.get(locators.menu.SIDE_MENU).click();
        cy.get("[data-cy=testLogout]").should("not.exist");
    });

    it("Should be able to log out when logged in", () => {
        cy.login();
        cy.get(locators.menu.SIDE_MENU).click();
        cy.get("[data-cy=testLogout]").should("exist").click();
        cy.url().should(
            "contains",
            "http://localhost:3000"
        );
    })
});
