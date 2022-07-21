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
    cy.get(`${locators.personality.SELECT_PERSONALITY} > *`).should("be.visible").click();
    cy.url().should(
        "contains",
        `http://localhost:3000/personality/${personality.slug}`
    );
    cy.get('[data-cy=testSeeFullSpeech]').click()
    cy.url().should("contains", `http://localhost:3000/personality/${personality.slug}/claim/${claim.slug}`)
    cy.get('[data-cy=frase1]').click()
    cy.url().should('contains', `http://localhost:3000/personality/${personality.slug}/claim/${claim.slug}/sentence`)
}

describe("Test claim review", () => {
    it('should not show start review when not logged in', () => {
        cy.visit(`http://localhost:3000/personality/${personality.slug}/claim/${claim.slug}`)
        cy.get('[data-cy=frase1]').click()
        cy.url().should('contains', `http://localhost:3000/personality/${personality.slug}/claim/${claim.slug}/sentence`)
        cy.get(locators.claimReview.BTN_START_CLAIM_REVIEW).should('not.exist')
    })

    it('should be able to assign a user', () => {
        cy.login()
        goToClaimReviewPage()
        cy.get(locators.claimReview.BTN_START_CLAIM_REVIEW).should('exist').click()
        cy.get(locators.claimReview.INPUT_USER).should('exist').type(review.username, { delay: 200 })
        cy.contains(review.username).first().click()
        cy.get('[title="reCAPTCHA"]').should('exist')
        cy.get(locators.claimReview.BTN_ASSIGN_USER).should('be.disabled')
        cy.checkRecaptcha()
        cy.get(locators.claimReview.BTN_ASSIGN_USER).should('be.enabled').click()
    })
})
