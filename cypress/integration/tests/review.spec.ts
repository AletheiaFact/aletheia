/* eslint-disable no-undef */
/// <reference types="cypress" />

import claim from "../../fixtures/claim";
import personality from "../../fixtures/personality";
import review from "../../fixtures/review";
import locators from "../../support/locators";

const goToClaimReviewPage = () => {
    cy.get(locators.personality.BTN_SEE_MORE_PERSONALITY)
        .should("be.visible")
        .click();
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
        cy.get(locators.claimReview.INPUT_SUMMARY).should("exist");
    });

    it("should only allow to submit report without any blank fields", () => {
        cy.login();
        goToClaimReviewPage();
        // all fields are left empty
        cy.get(locators.claimReview.INPUT_SUMMARY).should("exist");
        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_FINISH_REPORT)
            .should("be.enabled")
            .click();

        // all fields with blank spaces
        cy.get(locators.claimReview.INPUT_SUMMARY).should("exist").type(" ");
        cy.get(locators.claimReview.INPUT_QUESTION).should("exist").type(" ");
        cy.get(locators.claimReview.INPUT_REPORT).should("exist").type("    ");
        cy.get(locators.claimReview.INPUT_HOW).should("exist").type("        ");
        cy.get(locators.claimReview.INPUT_SOURCE)
            .should("exist")
            .type("      ");
        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_FINISH_REPORT)
            .should("be.enabled")
            .click();

        // all fields correct
        cy.get(locators.claimReview.INPUT_SUMMARY)
            .should("exist")
            .type(review.summary);
        cy.get(locators.claimReview.INPUT_QUESTION)
            .should("exist")
            .type(review.question1);
        cy.get(locators.claimReview.INPUT_REPORT)
            .should("exist")
            .type(review.report);
        cy.get(locators.claimReview.INPUT_HOW)
            .should("exist")
            .type(review.process);
        cy.get(locators.claimReview.INPUT_SOURCE)
            .should("exist")
            .type(review.source1);
        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_FINISH_REPORT)
            .should("be.enabled")
            .click();
        cy.get(locators.claimReview.INPUT_CLASSIFICATION).should("exist");
    });

    it("should only allow to submit review after choosing classification and reviewer", () => {
        cy.login();
        goToClaimReviewPage();

        cy.get(locators.claimReview.BTN_SUBMIT).should("be.disabled");
        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_SUBMIT).should("be.enabled").click();

        cy.get(locators.claimReview.INPUT_CLASSIFICATION)
            .should("exist")
            .click();
        cy.get(`[data-cy=${review.classification}]`)
            .should("be.visible")
            .click();

        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_SUBMIT).should("be.enabled").click();
        cy.get(locators.claimReview.INPUT_REVIEWER).should("exist");
    });
});
