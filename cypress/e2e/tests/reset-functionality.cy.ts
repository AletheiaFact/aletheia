/* eslint-disable no-undef */
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

const assignUserAndCreateReport = () => {
    // Assign user to task
    cy.get(locators.claimReview.BTN_START_CLAIM_REVIEW).should("exist").click();
    cy.get(locators.claimReview.INPUT_USER)
        .should("exist")
        .type(`${review.username}{downarrow}{enter}`, { delay: 200 });
    cy.get('[title="reCAPTCHA"]').should("exist");
    cy.get(locators.claimReview.BTN_ASSIGN_USER).should("be.disabled");
    cy.checkRecaptcha();
    cy.get(locators.claimReview.BTN_ASSIGN_USER).should("be.enabled").click();
    cy.get(locators.claimReview.INPUT_CLASSIFICATION).should("exist");
    
    // Wait longer for the form to fully load (like the working test)
    cy.wait(8000);

    // Fill out the report with data
    cy.get(locators.claimReview.INPUT_CLASSIFICATION)
        .should("exist")
        .click();
    cy.get(`[data-cy=${review.classification}]`)
        .should("be.visible")
        .click();

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

    cy.get(locators.claimReview.ADD_EDITOR_SOURCES)
        .should("be.visible")
        .click();
    cy.get(locators.claimReview.ADD_EDITOR_SOURCES_DIALOG_INPUT)
        .should("exist")
        .type(review.source1);
    cy.get(locators.claimReview.ADD_EDITOR_SOURCES_DIALOG_BUTTON)
        .should("be.visible")
        .click();

    // Save draft
    cy.checkRecaptcha();
    cy.get(locators.claimReview.BTN_SAVE_DRAFT).should("be.enabled").click();
    
    // Wait for save confirmation
    cy.wait(1000);
};

const verifyReportIsReset = () => {
    // Verify that all fields are cleared
    cy.get(locators.claimReview.INPUT_CLASSIFICATION).should("not.have.value");
    cy.get(locators.claimReview.INPUT_SUMMARY).should("not.have.value");
    cy.get(locators.claimReview.INPUT_QUESTION).should("not.have.value");
    cy.get(locators.claimReview.INPUT_REPORT).should("not.have.value");
    cy.get(locators.claimReview.INPUT_HOW).should("not.have.value");
    cy.get(locators.claimReview.INPUT_SOURCE).should("not.have.value");
    
    // Verify user is still assigned (task should remain in assigned state)
    cy.get(locators.claimReview.INPUT_USER).should("exist");
};

describe("Reset to Initial State Functionality", () => {
    before(() => {
        // Create personality and claim data once before all tests
        cy.login();
        
        // Create personality first
        cy.get(locators.floatButton.FLOAT_BUTTON).should("be.visible").click();
        cy.get(locators.floatButton.ADD_PERSONALITY)
            .should("be.visible")
            .click();
        cy.get(locators.personality.INPUT_SEARCH_PERSONALITY).type(
            personality.name
        );
        cy.get(`${locators.personality.SELECT_PERSONALITY}`).click();
        
        // Create claim
        cy.get(locators.personality.BTN_SEE_MORE_PERSONALITY)
            .should("be.visible")
            .click();
        cy.get(`${locators.personality.SELECT_PERSONALITY}`)
            .should("be.visible")
            .click();
        cy.url().should(
            "contains",
            `http://localhost:3000/personality/${personality.slug}`
        );

        cy.get(locators.floatButton.FLOAT_BUTTON).should("be.visible").click();
        cy.get(locators.floatButton.ADD_CLAIM).should("be.visible").click();
        cy.get(locators.claim.BTN_ADD_SPEECH).should("be.visible").click();

        cy.get(locators.claim.BTN_SELECT_PERSONALITY)
            .should("be.visible")
            .click();

        cy.get(locators.claim.INPUT_TITLE)
            .should("be.visible")
            .type(claim.title);

        cy.get("[data-cy=testContentClaim]")
            .should("be.visible")
            .type(claim.content);

        cy.get(locators.claim.INPUT_DATA).should("be.visible").click();
        cy.get(locators.claim.INPUT_DATA_TODAY).should("be.visible").click();

        cy.get(locators.claim.INPUT_SOURCE)
            .should("be.visible")
            .type(claim.source);

        cy.get("[data-cy=testCheckboxAcceptTerms]").click();

        cy.checkRecaptcha();
        cy.get(locators.claim.BTN_SUBMIT_CLAIM).click();
        cy.url().should(
            "contains",
            `http://localhost:3000/personality/${personality.slug}/claim/${claim.slug}`
        );
    });

    beforeEach(() => {
        cy.login();
        goToClaimReviewPage();
    });

    it("should show reset button for admin users", () => {
        assignUserAndCreateReport();
        
        // Check if reset button exists in the admin toolbar
        cy.get("[data-cy=testResetToInitialButton]")
            .should("exist")
            .and("be.visible");
    });

    it("should show reset button for assigned fact-checker", () => {
        assignUserAndCreateReport();
        
        // Verify reset button is visible for assigned user
        cy.get("[data-cy=testResetToInitialButton]")
            .should("exist")
            .and("be.visible");
    });

    it("should open confirmation dialog when reset button is clicked", () => {
        assignUserAndCreateReport();
        
        // Click reset button
        cy.get("[data-cy=testResetToInitialButton]").click();
        
        // Verify confirmation dialog appears
        cy.get("[data-cy=testResetConfirmationDialog]")
            .should("exist")
            .and("be.visible");
            
        // Verify dialog content
        cy.get("[data-cy=testResetDialogTitle]")
            .should("contain", "Reset Report to Initial State");
            
        cy.get("[data-cy=testResetReasonInput]")
            .should("exist")
            .and("be.visible");
            
        cy.get("[data-cy=testResetCancelButton]")
            .should("exist")
            .and("be.visible");
            
        cy.get("[data-cy=testResetConfirmButton]")
            .should("exist")
            .and("be.visible")
            .and("be.disabled"); // Should be disabled initially
    });

    it("should require reason input before allowing reset", () => {
        assignUserAndCreateReport();
        
        // Open reset dialog
        cy.get("[data-cy=testResetToInitialButton]").click();
        
        // Verify confirm button is disabled without reason
        cy.get("[data-cy=testResetConfirmButton]").should("be.disabled");
        
        // Enter reason
        cy.get("[data-cy=testResetReasonInput]")
            .type("Need to start over with different approach");
            
        // Verify confirm button is now enabled
        cy.get("[data-cy=testResetConfirmButton]").should("be.enabled");
    });

    it("should successfully reset report to initial state", () => {
        assignUserAndCreateReport();
        
        // Store original data to verify it was cleared
        cy.get(locators.claimReview.INPUT_SUMMARY).should("have.value", review.summary);
        cy.get(locators.claimReview.INPUT_QUESTION).should("have.value", review.question1);
        
        // Perform reset
        cy.get("[data-cy=testResetToInitialButton]").click();
        cy.get("[data-cy=testResetReasonInput]")
            .type("Testing reset functionality - need to start over");
        cy.get("[data-cy=testResetConfirmButton]").click();
        
        // Wait for reset to complete
        cy.wait(2000);
        
        // Verify success message
        cy.get(".MuiAlert-message, .toast-success")
            .should("contain", "Report reset to initial state successfully");
            
        // Verify report fields are cleared
        verifyReportIsReset();
    });

    it("should maintain assignment after reset", () => {
        assignUserAndCreateReport();
        
        // Perform reset
        cy.get("[data-cy=testResetToInitialButton]").click();
        cy.get("[data-cy=testResetReasonInput]")
            .type("Testing that assignment is preserved");
        cy.get("[data-cy=testResetConfirmButton]").click();
        
        // Wait for reset to complete
        cy.wait(2000);
        
        // Verify user is still assigned
        cy.get(locators.claimReview.INPUT_USER)
            .should("exist")
            .and("contain.value", review.username);
    });

    it("should allow canceling reset operation", () => {
        assignUserAndCreateReport();
        
        // Store original data
        const originalSummary = review.summary;
        
        // Open reset dialog and cancel
        cy.get("[data-cy=testResetToInitialButton]").click();
        cy.get("[data-cy=testResetReasonInput]")
            .type("This should be canceled");
        cy.get("[data-cy=testResetCancelButton]").click();
        
        // Verify dialog is closed
        cy.get("[data-cy=testResetConfirmationDialog]").should("not.exist");
        
        // Verify data is preserved
        cy.get(locators.claimReview.INPUT_SUMMARY)
            .should("have.value", originalSummary);
    });

    it("should handle reset from different workflow states", () => {
        assignUserAndCreateReport();
        
        // Progress to next state (finish report)
        cy.checkRecaptcha();
        cy.get(locators.claimReview.BTN_FINISH_REPORT).click();
        
        // Wait for state transition
        cy.wait(1000);
        
        // Verify reset is still available
        cy.get("[data-cy=testResetToInitialButton]")
            .should("exist")
            .and("be.visible");
            
        // Perform reset from this advanced state
        cy.get("[data-cy=testResetToInitialButton]").click();
        cy.get("[data-cy=testResetReasonInput]")
            .type("Resetting from reported state");
        cy.get("[data-cy=testResetConfirmButton]").click();
        
        // Wait and verify reset worked
        cy.wait(2000);
        verifyReportIsReset();
    });

    it("should create audit log entry for reset action", () => {
        assignUserAndCreateReport();
        
        // Perform reset
        cy.get("[data-cy=testResetToInitialButton]").click();
        cy.get("[data-cy=testResetReasonInput]")
            .type("Testing audit logging functionality");
        cy.get("[data-cy=testResetConfirmButton]").click();
        
        // Wait for reset to complete
        cy.wait(2000);
        
        // Navigate to history/audit section if available
        // This would depend on how audit logs are displayed in the UI
        cy.get("[data-cy=testViewHistory], [data-cy=testAuditLog]")
            .should("exist")
            .click();
            
        // Verify reset action is logged
        cy.get("[data-cy=testHistoryList]")
            .should("contain", "reset")
            .and("contain", "Testing audit logging functionality");
    });

    it("should display proper warning message in reset dialog", () => {
        assignUserAndCreateReport();
        
        // Open reset dialog
        cy.get("[data-cy=testResetToInitialButton]").click();
        
        // Verify warning message
        cy.get("[data-cy=testResetWarningMessage]")
            .should("exist")
            .and("contain", "This action will reset the report to its initial state")
            .and("contain", "All progress will be lost but the history will be preserved");
    });

    it("should show loading state during reset operation", () => {
        assignUserAndCreateReport();
        
        // Perform reset
        cy.get("[data-cy=testResetToInitialButton]").click();
        cy.get("[data-cy=testResetReasonInput]")
            .type("Testing loading state");
        cy.get("[data-cy=testResetConfirmButton]").click();
        
        // Verify loading state
        cy.get("[data-cy=testResetConfirmButton]")
            .should("contain", "Resetting...")
            .and("be.disabled");
    });
});

// Additional test suite for edge cases and error scenarios
describe("Reset Functionality - Edge Cases", () => {
    beforeEach(() => {
        cy.login();
        goToClaimReviewPage();
    });

    it("should handle API errors gracefully", () => {
        assignUserAndCreateReport();
        
        // Mock API failure
        cy.intercept('PUT', '**/reviewtask/*/reset', {
            statusCode: 500,
            body: { error: 'Internal server error' }
        }).as('resetError');
        
        // Attempt reset
        cy.get("[data-cy=testResetToInitialButton]").click();
        cy.get("[data-cy=testResetReasonInput]")
            .type("Testing error handling");
        cy.get("[data-cy=testResetConfirmButton]").click();
        
        // Wait for API call
        cy.wait('@resetError');
        
        // Verify error message is shown
        cy.get(".MuiAlert-message, .toast-error")
            .should("contain", "Failed to reset report");
            
        // Verify data is preserved after error
        cy.get(locators.claimReview.INPUT_SUMMARY)
            .should("have.value", review.summary);
    });

    it("should handle network timeout gracefully", () => {
        assignUserAndCreateReport();
        
        // Mock network timeout
        cy.intercept('PUT', '**/reviewtask/*/reset', {
            delay: 60000 // 1 minute delay to simulate timeout
        }).as('resetTimeout');
        
        // Attempt reset
        cy.get("[data-cy=testResetToInitialButton]").click();
        cy.get("[data-cy=testResetReasonInput]")
            .type("Testing timeout handling");
        cy.get("[data-cy=testResetConfirmButton]").click();
        
        // Should show appropriate timeout message
        cy.get(".MuiAlert-message, .toast-error")
            .should("contain", "Request timed out", { timeout: 10000 });
    });

    it("should prevent multiple simultaneous reset requests", () => {
        assignUserAndCreateReport();
        
        // Mock slow API response
        cy.intercept('PUT', '**/reviewtask/*/reset', {
            delay: 3000,
            statusCode: 200
        }).as('slowReset');
        
        // Start first reset
        cy.get("[data-cy=testResetToInitialButton]").click();
        cy.get("[data-cy=testResetReasonInput]")
            .type("Testing concurrent requests");
        cy.get("[data-cy=testResetConfirmButton]").click();
        
        // Button should be disabled during request
        cy.get("[data-cy=testResetConfirmButton]")
            .should("be.disabled");
            
        // Dialog should not allow closing during request
        cy.get("[data-cy=testResetCancelButton]")
            .should("be.disabled");
    });
});