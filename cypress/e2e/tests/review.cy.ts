/* eslint-disable no-undef */
/// <reference types="cypress" />

import claim from "../../fixtures/claim";
import personality from "../../fixtures/personality";
import review from "../../fixtures/review";
import source from "../../fixtures/source";
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

const assignUser = () => {
    cy.login();
    goToClaimReviewPage();
    cy.get(locators.claimReview.BTN_START_CLAIM_REVIEW).should("exist").click();
    cy.get(locators.claimReview.INPUT_USER)
        .should("exist")
        .type(review.username, { delay: 200 });
    cy.get(".ant-select-item-option-active").click();
    cy.get('[title="reCAPTCHA"]').should("exist");
    cy.get(locators.claimReview.BTN_ASSIGN_USER).should("be.disabled");
    cy.checkRecaptcha();
    cy.get(locators.claimReview.BTN_ASSIGN_USER).should("be.enabled").click();
    cy.get(locators.claimReview.INPUT_CLASSIFICATION).should("exist");
};

const blockAssignedUserReview = () => {
    cy.login();
    goToSourceReviewPage();
    cy.checkRecaptcha();
    cy.get(locators.claimReview.BTN_SELECTED_REVIEW).should("exist").click();
    cy.get(locators.claimReview.INPUT_REVIEWER)
        .should("exist")
        .type(review.username, { delay: 200 });
    cy.get(".ant-select-item-option-active").click();
    cy.checkRecaptcha();
    cy.get(locators.claimReview.BTN_SUBMIT).should("be.enabled").click();
    cy.get(locators.claimReview.TEXT_REVIEWER_ERROR).should("exist");
};

const goToSourceReviewPage = () => {
    cy.visit(`http://localhost:3000/source/${source.data_hash}`);
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

    it("should be able to assign a user", () => assignUser());

    it("should be able to submit full review fields", () => {
        cy.login();
        cy.intercept("GET", "/api/claimreviewtask/editor-content/*", (req) => {
            req.reply({
                statusCode: 200,
                body: review.editorContent,
                headers: {
                    "content-type": "application/json",
                },
            });
        });
        goToClaimReviewPage();
        cy.get(locators.claimReview.INPUT_CLASSIFICATION)
            .should("exist")
            .click();
        cy.get(`[data-cy=${review.classification}]`)
            .should("be.visible")
            .click();
        cy.get(locators.claimReview.BTN_ADD_QUESTION).should("exist").click();
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
        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_FINISH_REPORT)
            .should("be.enabled")
            .click();
        cy.get(locators.claimReview.BTN_SELECTED_REVIEW).should("exist");
    });

    it("should not be able submit after choosing assigned user as reviewer", () => {
        blockAssignedUserReview();
    });
});

describe("Test source review", () => {
    it("should not show start source review when not logged in", () => {
        goToSourceReviewPage();
        cy.get(locators.claimReview.BTN_START_CLAIM_REVIEW).should("not.exist");
    });

    it("should be able to assign a user", () => assignUser());

    it("should be able to submit source review fields", () => {
        cy.login();
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
        blockAssignedUserReview();
    });
});
