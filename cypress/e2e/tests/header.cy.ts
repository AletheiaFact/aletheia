/* eslint-disable no-undef */
/// <reference types="cypress" />

import user from "../../fixtures/user";
import locators from "../../support/locators";

describe("Test the header menus", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000");
        cy.title().should("contain", "AletheiaFact.org");
    });

    describe("Test the side drawer routes", () => {
        it("Open side bar and click about", () => {
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testAboutItem]").click();
            cy.url().should("contains", "about");
        });

        it("Open side bar and click privacy policy", () => {
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testPrivacyPolicyItem]").click();
            cy.url().should("contains", "privacy-policy");
        });

        it("Open side bar and click code of conduct", () => {
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testCodeOfConductItem]").click();
            cy.url().should("contains", "code-of-conduct");
        });
    });

    describe("Test the user icon menu actions", () => {
        it("Should not show log out when not logged in", () => {
            cy.get(locators.menu.USER_ICON).click();
            cy.get(locators.menu.LOGOUT_MENU).should("not.exist");
        });

        it("Should be able to access My Account page when logged in", () => {
            cy.login();
            cy.get(locators.menu.USER_ICON).click();
            cy.get(locators.menu.MY_ACCOUNT_MENU).should("exist").click();
            cy.url().should("contains", "profile");
        });

        it("Should be able to log out when logged in", () => {
            cy.login();
            cy.get(locators.menu.USER_ICON).click();
            cy.get(locators.menu.LOGOUT_MENU).should("exist").click();
            cy.title().should("contains", "Home");
        });
    });
});
