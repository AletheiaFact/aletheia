/* eslint-disable no-undef */
/// <reference types="cypress" />

import user from "../../fixtures/user";
import locators from "../../support/locators";

describe("Test the header menus", () => {
    before(() => {
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

        it("Should be able to click on the user icon and Login", () => {
            cy.visit("http://localhost:3000");
            cy.get(locators.menu.USER_ICON).click();
            cy.get(locators.menu.LOGIN_MENU).click();
            cy.url().should("contains", "login");
            cy.get(locators.login.USER).type(user.email);
            cy.get(locators.login.PASSWORD).type(user.password);
            cy.get(locators.login.BTN_LOGIN).click();
            cy.get(`${locators.claim.BTN_OK_TUTORIAL}`)
                .should("be.visible")
                .click();
        });

        it("Should be able to access My Account page when logged in", () => {
            cy.login();
            cy.get(locators.menu.USER_ICON).click();
            cy.get(locators.menu.MY_ACCOUNT_MENU).click();
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
