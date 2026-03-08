/// <reference types="cypress" />

import locators from "../../support/locators";
import {
    mockReviewTaskAssigned,
    mockSessionList,
} from "../../fixtures/copilotReviewV2";
import claim from "../../fixtures/claim";
import personality from "../../fixtures/personality";

const navigateToClaimPage = () => {
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

describe("CopilotReviewV2", () => {
    beforeEach(() => {
        cy.intercept("GET", "/api/copilot/sessions*", {
            statusCode: 200,
            body: mockSessionList,
        }).as("getSessions");

        cy.intercept("GET", "/api/reviewtask/hash/*", {
            statusCode: 200,
            body: mockReviewTaskAssigned,
        }).as("getReviewTask");
    });

    describe("Layout", () => {
        it("renders the V2 shell with three-column layout", () => {
            cy.login();
            navigateToClaimPage();
            cy.wait("@getReviewTask");

            cy.get(locators.copilotReviewV2.SHELL).should("exist");
            cy.get(locators.copilotReviewV2.SESSION_SIDEBAR).should("exist");
            cy.get(locators.copilotReviewV2.SIDEBAR_TOGGLE).should("exist");
        });

        it("renders mode switcher with Chat and Form tabs", () => {
            cy.login();
            navigateToClaimPage();
            cy.wait("@getReviewTask");

            cy.get(locators.copilotReviewV2.MODE_CHAT).should("exist");
            cy.get(locators.copilotReviewV2.MODE_FORM).should("exist");
        });

        it("renders report preview panel on desktop", () => {
            cy.login();
            navigateToClaimPage();
            cy.wait("@getReviewTask");

            cy.get(locators.copilotReviewV2.REPORT_PREVIEW).should("exist");
        });

        it("hides sidebar on mobile viewport", () => {
            cy.viewport(375, 812);
            cy.login();
            navigateToClaimPage();
            cy.wait("@getReviewTask");

            cy.get(locators.copilotReviewV2.SESSION_SIDEBAR).should(
                "not.be.visible"
            );
        });
    });

    describe("Mode Switching", () => {
        it("switches to form mode when Form tab is clicked", () => {
            cy.login();
            navigateToClaimPage();
            cy.wait("@getReviewTask");

            cy.get(locators.copilotReviewV2.MODE_FORM).click();
            cy.get(locators.copilotReviewV2.FORM_VIEW).should("exist");
        });

        it("switches back to chat mode when Chat tab is clicked", () => {
            cy.login();
            navigateToClaimPage();
            cy.wait("@getReviewTask");

            cy.get(locators.copilotReviewV2.MODE_FORM).click();
            cy.get(locators.copilotReviewV2.FORM_VIEW).should("exist");

            cy.get(locators.copilotReviewV2.MODE_CHAT).click();
            cy.get(locators.copilotReviewV2.FORM_VIEW).should("not.exist");
        });
    });

    describe("Session Sidebar", () => {
        it("renders session list items", () => {
            cy.login();
            navigateToClaimPage();
            cy.wait(["@getReviewTask", "@getSessions"]);

            cy.get(locators.copilotReviewV2.SESSION_ITEM).should(
                "have.length.at.least",
                1
            );
        });

        it("renders new chat button", () => {
            cy.login();
            navigateToClaimPage();
            cy.wait("@getReviewTask");

            cy.get(locators.copilotReviewV2.NEW_CHAT_BUTTON).should("exist");
        });
    });

    describe("Report Preview", () => {
        it("renders report preview panel with header", () => {
            cy.login();
            navigateToClaimPage();
            cy.wait("@getReviewTask");

            cy.get(locators.copilotReviewV2.REPORT_PREVIEW)
                .should("exist")
                .find(".preview-header")
                .should("exist");
        });
    });
});
