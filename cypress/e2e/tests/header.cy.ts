/// <reference types="cypress" />

import locators from "../../support/locators";

describe("Header - Navigation and Menus", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.title().should("contain", "AletheiaFact.org");
    });

    describe("Public Navigation (Direct Links)", () => {
        it("Should navigate to Personality page", () => {
            cy.get(locators.header.PERSONALITY_ITEM).click();
            cy.url().should("contain", "/personality");
        });

        it("Should navigate to Claim page", () => {
            cy.get(locators.header.CLAIM_ITEM).click();
            cy.url().should("contain", "/claim");
        });

        it("Should navigate to Verification Request page", () => {
            cy.get(locators.header.VERIFICATION_REQUEST_ITEM).click();
            cy.url().should("contain", "/verification-request");
        });

        //functionality temporarily removed
        it.skip("Should navigate to Source page", () => {
            cy.get(locators.header.SOURCE_ITEM).click();
            cy.url().should("contain", "/source");
        });
    });

    describe("Institutional Menu (Dropdown)", () => {
        beforeEach(() => {
            cy.get(locators.header.OPEN_INSTITUTION_MENU).click();
        });

        it("Should navigate to About page via Institutional Menu", () => {
            cy.get(locators.header.ABOUT_ITEM).click();
            cy.url().should("contain", "/about");
        });

        it("Should navigate to Privacy Policy page", () => {
            cy.get(locators.header.PRIVACY_POLICY_ITEM).click();
            cy.url().should("contain", "/privacy-policy");
        });

        it("Should navigate to Code of Conduct page", () => {
            cy.get(locators.header.CODE_OF_CONDUCT_ITEM).click();
            cy.url().should("contain", "/code-of-conduct");
        });

        it("Should navigate to Supportive Materials page", () => {
            cy.get(locators.header.SUPPORTIVE_MATERIALS_ITEM).click();
            cy.url().should("contain", "/supportive-materials");
        });
    });

    describe("User Menu - Anonymous Access", () => {
        it("Should not display Logout option when user is not authenticated", () => {
            cy.get(locators.header.OPEN_USER_MENU).click();
            cy.get(locators.header.LOGOUT_ITEM).should("not.exist");
        });
    });

    describe("User Menu - Authenticated Access", () => {
        beforeEach(() => {
            cy.login();
            cy.get(locators.header.OPEN_USER_MENU).click();
        });

        it("Should navigate to Profile page", () => {
            cy.get(locators.header.PROFILE_ITEM).click();
            cy.url().should("contain", "/profile");
        });

        it("Should navigate to Kanban board", () => {
            cy.get(locators.header.KANBAN_ITEM).click();
            cy.url().should("contain", "/kanban");
        });

        it("Should navigate to Admin dashboard", () => {
            cy.get(locators.header.ADMIN_ITEM).click();
            cy.url().should("contain", "/admin");
        });

        it("Should navigate to Badges management", () => {
            cy.get(locators.header.BADGES_ITEM).click();
            cy.url().should("contain", "/admin/badges");
        });

        it("Should navigate to Namespace management", () => {
            cy.get(locators.header.NAMESPACE_ITEM).click();
            cy.url().should("contain", "/admin/name-spaces");
        });

        it("Should perform logout successfully", () => {
            cy.get(locators.header.LOGOUT_ITEM).should("exist").click();
            cy.title().should("contain", "Home");
        });
    });
});
