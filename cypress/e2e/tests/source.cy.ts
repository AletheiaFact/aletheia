/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locators";
import source from "../../fixtures/source";

describe("Create source", () => {
    beforeEach("login", () => cy.login());

    it("Should create a new Source", () => {
        cy.get(locators.floatButton.FLOAT_BUTTON).should("be.visible").click();
        cy.get(locators.floatButton.ADD_SOURCE).should("be.visible").click();

        cy.url().should("contains", "source");
        cy.get(locators.source.INPUT_SOURCE).type(source.href);
        cy.checkRecaptcha();
        cy.get(`${locators.source.BTN_SUBMIT_SOURCE}`).click();
    });
});
