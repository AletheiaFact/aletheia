/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locators";
import source from "../../fixtures/source";
import { assignUser, blockAssignedUserReview } from "./review.cy";
import review from "../../fixtures/review";

const goToSourceReviewPage = () => {
    cy.visit(`http://localhost:3000/source/${source.data_hash}`);
};

describe("Create source and source review", () => {
    beforeEach("login", () => cy.login());

    it("Should create a new Source", () => {
        cy.get(locators.floatButton.FLOAT_BUTTON).should("be.visible").click();
        cy.get(locators.floatButton.ADD_SOURCE).should("be.visible").click();

        cy.url().should("contains", "source");
        cy.get(locators.source.INPUT_SOURCE).type(source.href);
        cy.checkRecaptcha();
        cy.get(`${locators.source.BTN_SUBMIT_SOURCE}`).click();
    });

    it("should not show start source review when not logged in", () => {
        goToSourceReviewPage();
        cy.get(locators.claimReview.BTN_START_CLAIM_REVIEW).should("not.exist");
    });

    it("should be able to assign a user", () => {
        goToSourceReviewPage();
        assignUser();
    });

    it("should be able to submit source review fields", () => {
        goToSourceReviewPage();
        cy.get(locators.claimReview.INPUT_CLASSIFICATION)
            .should("exist")
            .click();
        cy.get(`[data-cy=${review.classification}]`)
            .should("be.visible")
            .click();

        cy.get(locators.claimReview.INPUT_SUMMARY)
            .should("exist")
            .type(review.summary);

        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_FINISH_REPORT)
            .should("be.enabled")
            .click();
        cy.get(locators.claimReview.BTN_SELECTED_REVIEW).should("exist");
    });

    it("should not be able submit after choosing assigned user as reviewer", () => {
        goToSourceReviewPage();
        blockAssignedUserReview();
    });
});
