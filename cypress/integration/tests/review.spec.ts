/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locator";

describe("Test claim review", () => {
    it('should not show start review when not logged in', () => {
        cy.visit('http://localhost:3000/personality/beyonce/claim/cantora-e-dancarina')
        cy.get('[data-cy=frase1]').click()
        cy.url().should('contains', 'http://localhost:3000/personality/beyonce/claim/cantora-e-dancarina/sentence')
        cy.get(locators.CLAIM_REVIEW.BTN_START_CLAIM_REVIEW).should('not.exist')
    })

    it('should show start review and recaptcha when logged in', () => {
        cy.login()
        cy.get(locators.PERSONALITY.BTN_SEE_MORE_PERSONALITY)
            .should("be.visible")
            .click();
        cy.get("[data-cy=Beyoncé] > *").should("be.visible").click();
        cy.url().should(
            "contains",
            "http://localhost:3000/personality/beyonce"
        );
        cy.get('[data-cy=testSeeFullSpeech]').click()
        cy.url().should("contains", 'http://localhost:3000/personality/beyonce/claim/cantora-e-dancarina')
        cy.get('[data-cy=frase1]').click()
        cy.url().should('contains', 'http://localhost:3000/personality/beyonce/claim/cantora-e-dancarina/sentence')
        cy.get(locators.CLAIM_REVIEW.BTN_START_CLAIM_REVIEW).should('exist').click()
        cy.get('[data-cy=testClaimReviewuserId]').should('exist').type("user", {delay: 200})
        cy.contains("User").first().click()
        cy.get('[title="reCAPTCHA"]').should('exist')
        cy.get('[data-cy=testClaimReviewASSIGN_USER]').should('be.disabled')
        cy.checkRecaptcha()
        cy.get('[data-cy=testClaimReviewASSIGN_USER]').should('be.enabled')
    })
})
