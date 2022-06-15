/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../support/locator";

//If you want to test a single test from (it), write .only after it , getting it.only

describe("Check side bar and Login", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/home");

        cy.title().should("contain", "AletheiaFact.org");

        cy.get("[data-cy=testSideMenuClosed] > .anticon").click();
        cy.get("[data-cy=testMyAccountItem] > .ant-menu-title-content").click();

        cy.get(locators.LOGIN.USER)
            .should("be.visible")
            .type("test@aletheiafact.org", {
                delay: 200,
            });
        cy.get(locators.LOGIN.PASSWORD)
            .should("be.visible")
            .type("TEST_USER_PASS");
        cy.get(locators.LOGIN.BTN_LOGIN).should("be.visible").click();
    });

    it("Claim", () => {
        cy.get(locators.PERSONALITY.BTN_SEE_MORE_PERSONALITY)
            .should("be.visible")
            .click();
        cy.get("[data-cy=Beyoncé] > *").should("be.visible").click();
        cy.url().should(
            "contains",
            "http://localhost:3000/personality/beyonce"
        );

        cy.get("[data-cy=testButtonAddClaim] > .anticon")
            .should("be.visible")
            .click();

        cy.get("[ data-cy=testTitleClaimForm]")
            .should("be.visible")
            .type("Cantora e Dançarina?");

        cy.get("[ data-cy=testContentClaim]")
            .should("be.visible")
            .type("Ele é uma ótima dançarina e cantora");

        cy.get("[data-cy=dataAserSelecionada]").should("be.visible").click();
        cy.contains(7).click();

        //    cy.get(".ant-picker-today-btn").click();

        cy.get(".ant-layout-content").click();

        cy.get(".ant-col-24 > .ant-input")
            .should("be.visible")
            .type("http://wikipedia.org");

        cy.get("[data-cy=testCheckboxAcceptTerms]").click();

        cy.get("iframe").then((iframe) => {
            const body = iframe.contents().find("body");
            cy.wrap(body)
                .find("#recaptcha-anchor")
                // .should("be.empty")
                .click();
        });
        cy.get("[data-cy=testSaveButton]").click();

        // cy.get("[data-cy=testSearchPersonality] > .anticon").click();
    });
    // This is not checkbox

    it.only("Claim review from an existing one", () => {
        cy.visit("http://localhost:3000/personality");

        cy.get("[data-cy=Beyoncé]").click();
        cy.url().should(
            "contains",
            "http://localhost:3000/personality/beyonce"
        );
        cy.get("[data-cy=testSeeFullSpeech]").last().click();
        cy.url().should(
            "contains",
            "http://localhost:3000/personality/beyonce/claim/cantora-e-dancarina"
        );

        cy.get("[data-cy=frase1]")
            .should("contain", "dançarina e cantora")
            .click();
        cy.url().should(
            "contains",
            "http://localhost:3000/personality/beyonce/claim/cantora-e-dancarina/sentence/c2b74a9ccff0038975d51283c10e457d"
        );

        cy.get("[data-cy=testAddReviewButton]").should("be.visible").click();

        cy.get("[data-cy=testClassificationText]").should("be.visible").click();
        cy.get("[data-cy=true]").click();
        cy.wait(1000);
        cy.get(".ant-select-selection-item > [data-cy=true]").should(
            "contain",
            "Trustworthy"
        );
        cy.get(".Input__AletheiaInput-sc-1gffuww-0")
            .should("be.visible")
            .click()
            .type("https://www.wikipedia.org/");
        cy.get("[data-cy=testReportInput]")
            .should("be.visible")
            .click()
            .type(
                "Além de treinar o canto, a Beyoncé tem ensaios diários de dança e treinamento físico para melhorar sua condição cardiorespirátoria"
            );

        cy.get("iframe").then((iframe) => {
            const body = iframe.contents().find("body");
            cy.wrap(body).find("#recaptcha-anchor").click();
        });
        cy.get("[data-cy=testAddReviewButton]").click();
    });
});
