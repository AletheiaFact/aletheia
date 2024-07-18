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
        it("Open side bar and click personality", () => {
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testPersonalitytItem]").click();
            cy.url().should("contains", "personality");
        });

        it("Open side bar and click claim", () => {
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testClaimtItem]").click();
            cy.url().should("contains", "claim");
        });

        it("Open side bar and click source", () => {
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testSourcetItem]").click();
            cy.url().should("contains", "source");
        });

        it("Open side bar and click source", () => {
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testVerificationRequestItem]").click();
            cy.url().should("contains", "verification-request");
        });

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

        it("Open side bar and click supportive materials", () => {
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testSupportiveMaterialsItem]").click();
            cy.url().should("contains", "supportive-materials");
        });
    });

    describe("Test the side drawer routes that requires user permission", () => {
        it("Should be able to access Kanban page when logged in", () => {
            cy.login();
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testKanbantItem]").click();
            cy.url().should("contains", "kanban");
        });

        it("Should be able to access Admin page when logged in", () => {
            cy.login();
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testadminItem]").click();
            cy.url().should("contains", "admin");
        });

        it("Should be able to access Badges page when logged in", () => {
            cy.login();
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testadminBadgeItem]").click();
            cy.url().should("contains", "admin/badges");
        });

        it("Should be able to access Namespaces page when logged in", () => {
            cy.login();
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testadminNameSpaceItem]").click();
            cy.url().should("contains", "admin/name-spaces");
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
