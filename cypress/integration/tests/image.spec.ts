/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locators";
import claim from "../../fixtures/claim";

describe("Create image claim", () => {
    beforeEach("login", () => cy.login());
    it("Should create a image claim", () => {
        cy.get(locators.floatButton.FLOAT_BUTTON).should("be.visible").click();
        cy.get(locators.floatButton.ADD_CLAIM).should("be.visible").click();
        cy.get(locators.claim.BTN_ADD_IMAGE).should("be.visible").click();
        cy.get(locators.claim.BTN_NO_PERSONALITY).should("be.visible").click();
        cy.get("[ data-cy=testTitleClaimForm]")
            .should("be.visible")
            .type(claim.title);

        cy.get("[data-cy=dataAserSelecionada]").should("be.visible").click();
        cy.get("a.ant-picker-today-btn")
            .contains("Today")
            .should("be.visible")
            .click();

        cy.get("[data-cy=testSource1]").should("be.visible").type(claim.source);
        cy.get(locators.claim.BTN_UPLOAD_IMAGE).should("be.visible").click();
    });
});
