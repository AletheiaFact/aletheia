/// <reference types="cypress" />

import claim from "../../fixtures/claim";
import personality from "../../fixtures/personality";
import review from "../../fixtures/review";
import locators from "../../support/locators";

const goToClaimReviewPage = () => {
    cy.get(`${locators.personality.SELECT_PERSONALITY} > *`)
        .should("be.visible")
        .first()
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

/**
 * Completes the reCAPTCHA inside the RecaptchaModal and clicks confirm.
 * The modal opens automatically when a non-exempt action button is clicked.
 */
const completeRecaptchaModal = () => {
    cy.checkRecaptcha();
    cy.get(locators.claimReview.BTN_RECAPTCHA_CONFIRM)
        .should("be.visible")
        .and("be.enabled")
        .click();
};

const assignUser = () => {
    cy.get(locators.claimReview.BTN_START_CLAIM_REVIEW).should("exist").click();
    cy.get(locators.claimReview.INPUT_USER)
        .should("exist")
        .type(`${review.username}{downarrow}{enter}`, { delay: 200 });
    // Click the assign button which opens the recaptcha modal
    cy.get(locators.claimReview.BTN_ASSIGN_USER).should("be.visible").click();
    completeRecaptchaModal();
    cy.get(locators.claimReview.INPUT_CLASSIFICATION).should("exist");
};

const blockAssignedUserReview = () => {
    // Wait for the form to be fully loaded with review data (including classification)
    cy.get(locators.claimReview.INPUT_CLASSIFICATION).should("exist");
    // SELECTED_REVIEW is captcha-exempt (navigation only), so it works directly
    cy.get(locators.claimReview.BTN_SELECTED_REVIEW)
        .should("be.visible")
        .and("be.enabled")
        .click();
    cy.get(locators.claimReview.INPUT_REVIEWER)
        .should("exist")
        .type(`${review.username}{downarrow}{downarrow}{enter}`, {
            delay: 200,
        });
    // SEND_TO_REVIEW requires captcha, so clicking it opens the modal
    cy.get(locators.claimReview.BTN_SUBMIT).should("be.visible").click();
    completeRecaptchaModal();
    cy.get(locators.claimReview.TEXT_REVIEWER_ERROR).should("exist");
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
        assignUser();
    });

    it("should be able to submit full review fields", () => {
        cy.login();
        cy.intercept("GET", "/api/reviewtask/editor-content/*", (req) => {
            req.reply({
                statusCode: 200,
                body: review.editorContent,
                headers: {
                    "content-type": "application/json",
                },
            });
        });
        goToClaimReviewPage();
        cy.wait(8000);
        cy.get(locators.claimReview.INPUT_CLASSIFICATION)
            .should("exist")
            .click();
        cy.get(`[data-cy=${review.classification}]`)
            .should("be.visible")
            .click();
        cy.get(locators.claimReview.BTN_ADD_QUESTION).should("exist").click();
        cy.wait(6000);
        cy.get(locators.claimReview.INPUT_QUESTION)
            .eq(1)
            .type(review.question2);
        cy.get(locators.claimReview.INPUT_SUMMARY)
            .should("exist")
            .type(review.summary);
        cy.get(locators.claimReview.INPUT_REPORT)
            .should("exist")
            .type(review.report);
        cy.get(locators.claimReview.INPUT_HOW)
            .should("exist")
            .type(review.process);
        cy.get(locators.claimReview.ADD_EDITOR_SOURCES)
            .should("be.visible")
            .click();
        cy.get(locators.claimReview.ADD_EDITOR_SOURCES_DIALOG_INPUT)
            .should("exist")
            .type(review.source2);
        cy.get(locators.claimReview.ADD_EDITOR_SOURCES_DIALOG_BUTTON)
            .should("be.visible")
            .click();
        // FINISH_REPORT requires captcha, clicking opens the modal
        cy.get(locators.claimReview.BTN_FINISH_REPORT)
            .should("be.visible")
            .click();
        completeRecaptchaModal();
        cy.get(locators.claimReview.BTN_SELECTED_REVIEW).should("exist");
    });

    it("should not be able submit after choosing assigned user as reviewer", () => {
        cy.intercept("GET", "/api/reviewtask/hash/*").as("getReviewTask");
        cy.login();
        goToClaimReviewPage();
        cy.wait("@getReviewTask");
        blockAssignedUserReview();
    });
});
