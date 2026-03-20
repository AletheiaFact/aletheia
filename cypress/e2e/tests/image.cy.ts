/// <reference types="cypress" />

import locators from "../../support/locators";
import claim from "../../fixtures/claim";
import { today } from "../../utils/dateUtils";

describe("Create image claim", () => {
    beforeEach("login", () => cy.login());
    it("Should create a image claim without personality", () => {
        cy.get(locators.floatButton.FLOAT_BUTTON).should("be.visible").click();
        cy.get(locators.floatButton.ADD_CLAIM).should("be.visible").click();
        cy.get(locators.claim.BTN_ADD_IMAGE).should("be.visible").click();
        cy.get(locators.claim.BTN_NO_PERSONALITY).should("be.visible").click();
        cy.get(locators.claim.INPUT_TITLE)
            .should("be.visible")
            .type(claim.imageTitle);

        cy.selectDatePickerDate(0, today)

        cy.get(locators.claim.INPUT_SOURCE)
            .should("be.visible")
            .type(claim.imageSource);
        cy.get(locators.claim.BTN_UPLOAD_IMAGE).should("be.visible");
        cy.get('input[type="file"]').selectFile(claim.imageSourceFile, {
            force: true,
        });
        cy.get("[data-cy=testCheckboxAcceptTerms]").click();

        cy.checkRecaptcha();
        cy.get(locators.claim.BTN_SUBMIT_CLAIM).should("be.visible").click();
        cy.title().should("contain", claim.imageTitle);
    });
});
