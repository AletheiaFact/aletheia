/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locator";

describe("Test the side route", () => {
    beforeEach (() => {

    cy.visit('http://localhost:3000/home')

    cy.title().should('be.equal', 'AletheiaFact.org');
    cy.get('#rcc-confirm-button').click()
    });

    it("Check lateral menu and Login" , () => {
        cy.get('[data-cy=testSideMenuClosed] > .anticon').click()
        cy.get('[data-cy=testMyAccountItem] > .ant-menu-title-content').click()
        cy.get(locators.LOGIN.USER).type("test@aletheiafact.org", {
            delay: 200,
        })
        cy.get(locators.LOGIN.PASSWORD).type("123456")
        cy.get(locators.LOGIN.BTN_LOGIN).click()
    });

    it("Return lateral menu and go page about", () => {
        cy.get('[data-cy=testSideMenuClosed] > .anticon').click()
        cy.get('[data-cy=testAboutItem] > .ant-menu-title-content').click()
    })

    it("Lateral menu and go polity", () => {
        cy.get('[data-cy=testSideMenuClosed] > .anticon').click()
        cy.get('[data-cy=testPrivacyPolicyItem] > .ant-menu-title-content').click()
    })

    it("Lateral menu and go conduct", () => {
        cy.get('[data-cy=testCodeOfConductItem] > .ant-menu-title-content').click()
        cy.get('.ant-col-20 > * > [data-cy=logo]').click()
    })
})
