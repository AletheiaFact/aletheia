/// <reference types="cypress" />
/// <reference types="@percy/cypress" />

import locators from "../../../support/locators";
import user from "../../../fixtures/user";

const baseUrlProduction = Cypress.env("BASE_URL_PRODUCTION"); // Production

const baseUrlEnvironment = Cypress.env("BASE_URL_TEST_ENVIRONMENT"); // Test

const login = (username: string, password: any): void => {
    cy.get(locators.login.BTN_LOGIN).should("be.visible");
    cy.get(locators.login.USER).should("be.empty").type(username);
    cy.get(locators.login.PASSWORD).type(password);
    cy.get(locators.login.BTN_LOGIN).click();
};

describe("Test regression Home Page", () => {
    it("Verifies the home page the url test and snapshots", () => {
        const environment = "Test"; // identificy the environment
        const baseUrl = baseUrlEnvironment;

        if (cy.isPercyEnabled()) {
            cy.log(`Percy está ativado? ${Cypress.env("PERCY_ENABLED")}`);
            cy.log(
                `O ambiente detectado pelo Cypress é: ${Cypress.env(
                    "ENVIRONMENT"
                )}`
            );

            cy.visit(`${baseUrl}`);
            cy.title().should("contain", "AletheiaFact.org");
            cy.url().should("contains", "login");
            cy.percySnapshot(`${environment} - Login Page`, {
                widths: [768, 1024, 1280],
            });

            cy.get('[id="rcc-confirm-button"]').should("be.visible");
            cy.get('[id="rcc-confirm-button"]').click();
            cy.percySnapshot(
                `${environment} - Login Page without Cookie Consent`,
                { widths: [768, 1024, 1280] }
            );

            login("knascimento+qatest@aletheiafact.org", user.password);

            cy.get(`${locators.claim.BTN_OK_TUTORIAL}`).should("be.visible");
            cy.percySnapshot(`${environment} - Home page with modal tutorial`, {
                widths: [768, 1024, 1280],
            });

            cy.get(`${locators.claim.BTN_OK_TUTORIAL}`).click();
            cy.percySnapshot(
                `${environment} - Home page with Donation Banner`,
                { widths: [768, 1024, 1280] }
            );

            cy.get('[data-testid="CloseOutlinedIcon"]')
                .should("be.visible")
                .click();
            cy.percySnapshot(
                `${environment} - Home page without Donation Banner`,
                { widths: [768, 1024, 1280] }
            );
        }
    });
    it("Verifies the home page the url production and snapshots", () => {
        const environment = "Production"; // identificy simple for environment
        const baseUrl = baseUrlProduction;

        if (cy.isPercyEnabled()) {
            cy.log(`Percy está ativado? ${Cypress.env("PERCY_ENABLED")}`);
            cy.log(
                `O ambiente detectado pelo Cypress é: ${Cypress.env(
                    "ENVIRONMENT"
                )}`
            );

            cy.visit(`${baseUrl}/login`);
            cy.title().should("contain", "AletheiaFact.org");
            cy.url().should("contain", "login");
            cy.percySnapshot(`${environment} - Login page`, {
                widths: [768, 1024, 1280],
            });

            cy.get('[id="rcc-confirm-button"]').should("be.visible");
            cy.get('[id="rcc-confirm-button"]').click();
            cy.percySnapshot(
                `${environment} - Login page without Cookie Consent`,
                { widths: [768, 1024, 1280] }
            );

            login("keikonichimoto@aletheiafact.org", user.password);

            cy.get(`${locators.claim.BTN_OK_TUTORIAL}`).should("be.visible");
            cy.percySnapshot(`${environment} - Home page with modal tutorial`, {
                widths: [768, 1024, 1280],
            });

            cy.get(`${locators.claim.BTN_OK_TUTORIAL}`).click();
            cy.percySnapshot(
                `${environment} - Home page with Donation Banner`,
                { widths: [768, 1024, 1280] }
            );

            cy.get('[data-testid="CloseOutlinedIcon"]')
                .should("be.visible")
                .click();
            cy.percySnapshot(
                `${environment} - Home page without Donation Banner`,
                { widths: [768, 1024, 1280] }
            );
        }
    });
});
