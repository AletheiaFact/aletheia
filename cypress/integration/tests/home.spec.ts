/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locator";

describe("Test the side route", () => {
    beforeEach("Check side bar and Login", () => {
        cy.visit("http://localhost:3000/home");

        cy.title().should("contain", "AletheiaFact.org");
        cy.get("#rcc-confirm-button").click();

        cy.get("[data-cy=testSideMenuClosed] > .anticon").click();
        cy.get("[data-cy=testMyAccountItem] > .ant-menu-title-content").click();
        cy.get(locators.LOGIN.USER).type("test@aletheiafact.org", {
            delay: 200,
        });
        cy.get(locators.LOGIN.PASSWORD).type("TEST_USER_PASS");
        cy.get(locators.LOGIN.BTN_LOGIN).click();
    });

    it("Return side bar and go page about", () => {
        cy.get("[data-cy=testSideMenuClosed] > .anticon").click();
        cy.get("[data-cy=testAboutItem] > .ant-menu-title-content").click();
    });

    it("Side bar and go polity", () => {
        cy.get("[data-cy=testSideMenuClosed] > .anticon").click();
        cy.get(
            "[data-cy=testPrivacyPolicyItem] > .ant-menu-title-content"
        ).click();
        cy.get(".ant-col-20 > * > [data-cy=logo]").click();
    });

    it("Side bar and go code of conduct", () => {
        cy.get("[data-cy=testSideMenuClosed] > .anticon").click();
        cy.get(
            "[data-cy=testCodeOfConductItem] > .ant-menu-title-content"
        ).should("contain", "Code of Conduct");
        cy.get("[data-cy=testCodeOfConductItem] > .ant-menu-title-content")
            .wait(100)
            .click();
    });
});
