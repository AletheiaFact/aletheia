/* eslint-disable no-undef */
/// <reference types="cypress" />

import claim from "../../fixtures/claim";
import personality from "../../fixtures/personality";
import review from "../../fixtures/review";
import locators from "../../support/locators";

const goToClaimReviewPage = () => {
    cy.get(`${locators.personality.SELECT_PERSONALITY} > *`)
        .should("be.visible")
        .click();
    cy.url().should(
        "contains",
        `http://localhost:3000/personality/${personality.slug}`
    );
    cy.get("[data-cy=testSeeFullSpeech]").first().click();
    cy.url().should(
        "contains",
        `http://localhost:3000/personality/${personality.slug}/claim/${claim.slug}`
    );
    cy.get("[data-cy=frase1]").click();
    cy.get(locators.claim.BTN_SEE_FULL_REVIEW).should("exist");
};

describe("Test claim review", () => {
    it("should not show start review when not logged in", () => {
        cy.visit(
            `http://localhost:3000/personality/${personality.slug}/claim/${claim.slug}`
        );
        cy.get("[data-cy=frase1]").click();
        cy.get(locators.claim.BTN_SEE_FULL_REVIEW).should("exist");
        cy.get(locators.claimReview.BTN_START_CLAIM_REVIEW).should("not.exist");
    });

    it("should be able to assign a user", () => {
        cy.login();
        goToClaimReviewPage();
        cy.get(locators.claimReview.BTN_START_CLAIM_REVIEW)
            .should("exist")
            .click();
        cy.get(locators.claimReview.INPUT_USER)
            .should("exist")
            .type(review.username, { delay: 200 });
        cy.get(".ant-select-item-option-active").click();
        cy.get('[title="reCAPTCHA"]').should("exist");
        cy.get(locators.claimReview.BTN_ASSIGN_USER).should("be.disabled");
        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_ASSIGN_USER)
            .should("be.enabled")
            .click();
        cy.get(locators.claimReview.INPUT_CLASSIFICATION).should("exist");
    });

    it("should be able to submit partial review fields", () => {
        cy.login();
        goToClaimReviewPage();
        cy.get(locators.claimReview.INPUT_CLASSIFICATION)
            .should("exist")
            .click();
        cy.get(`[data-cy=${review.classification}]`)
            .should("be.visible")
            .click();
        cy.get(locators.claimReview.INPUT_SUMMARY)
            .should("exist")
            .type(review.summary);
        cy.get(locators.claimReview.INPUT_SOURCE)
            .should("exist")
            .type(review.source1);
        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_FULL_REVIEW)
            .should("be.enabled")
            .click();
        cy.get(locators.claimReview.INPUT_REPORT).should("exist");
    });

    it("should be able to submit full review fields", () => {
        cy.login();
        goToClaimReviewPage();
        cy.get(locators.claimReview.INPUT_REPORT)
            .should("exist")
            .type(review.report);
        cy.get(locators.claimReview.INPUT_QUESTION)
            .should("exist")
            .type(review.question1);
        cy.get(locators.claimReview.INPUT_HOW)
            .should("exist")
            .type(review.process);
        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_FINISH_REPORT)
            .should("be.enabled")
            .click();
        cy.get(locators.claimReview.INPUT_REVIEWER).should("exist");
    });

    it("should not be able submit after choosing assigned user as reviewer", () => {
        cy.login();
        goToClaimReviewPage();
        cy.get(locators.claimReview.INPUT_REVIEWER)
            .should("exist")
            .type(review.username, { delay: 200 });
        cy.get(".ant-select-item-option-active").click();
        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_SUBMIT).should("be.enabled").click();
        cy.get(locators.claimReview.TEXT_REVIEWER_ERROR).should("exist");
    });
});
