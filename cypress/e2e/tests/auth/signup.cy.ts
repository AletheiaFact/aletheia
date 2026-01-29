/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../../support/locators";

describe("Sign Up tests", () => {
    const TIMEOUT = {
        DEFAULT: 10000,
        API: 30000,
    };

    const testUser = {
        name: "Test User",
        email: `test${Date.now()}@aletheiafact.org`,
        password: "TestPassword123!",
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();

        cy.goToSignUpPage();

        cy.get('iframe[title="reCAPTCHA"]', { timeout: TIMEOUT.DEFAULT })
            .should("be.visible")
            .its("0.contentDocument.body")
            .should("not.be.empty");
    });

    it("Should display sign up form", () => {
        cy.get(locators.signup.NAME).should("be.visible");
        cy.get(locators.signup.EMAIL).should("be.visible");
        cy.get(locators.signup.PASSWORD).should("be.visible");
        cy.get(locators.signup.REPEATED_PASSWORD).should("be.visible");
        cy.get('iframe[title="reCAPTCHA"]').should("be.visible");
        cy.get(locators.signup.BTN_SUBMIT).should("be.visible");
    });

    it("Should show validation error when name is empty", () => {
        cy.get(locators.signup.EMAIL).clear().type(testUser.email);
        cy.get(locators.signup.PASSWORD).clear().type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD)
            .clear()
            .type(testUser.password);
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();

        cy.get(locators.signup.ERROR_NAME, { timeout: TIMEOUT.DEFAULT }).should(
            "be.visible"
        );
    });

    it("Should show validation error when email is invalid", () => {
        cy.get(locators.signup.NAME).clear().type(testUser.name);
        cy.get(locators.signup.EMAIL).clear().type("invalid-email");
        cy.get(locators.signup.PASSWORD).clear().type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD)
            .clear()
            .type(testUser.password);
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();

        cy.get(locators.signup.ERROR_EMAIL, {
            timeout: TIMEOUT.DEFAULT,
        }).should("be.visible");
    });

    it("Should show validation error when passwords don't match", () => {
        cy.get(locators.signup.NAME).clear().type(testUser.name);
        cy.get(locators.signup.EMAIL).clear().type(testUser.email);
        cy.get(locators.signup.PASSWORD).clear().type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD)
            .clear()
            .type("DifferentPassword123!");
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();

        cy.get(locators.signup.ERROR_REPEATED_PASSWORD, {
            timeout: TIMEOUT.DEFAULT,
        }).should("be.visible");
    });

    it("Should show error when CAPTCHA is not completed", () => {
        cy.get(locators.signup.NAME).clear().type(testUser.name);
        cy.get(locators.signup.EMAIL).clear().type(testUser.email);
        cy.get(locators.signup.PASSWORD).clear().type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD)
            .clear()
            .type(testUser.password);
        cy.get(locators.signup.BTN_SUBMIT).click();

        cy.get(".ant-message-error, .MuiAlert-standardError, [role='alert']", {
            timeout: TIMEOUT.DEFAULT,
        }).should("be.visible");
    });

    it("Should successfully create account with valid data and CAPTCHA", () => {
        cy.get(locators.signup.NAME).clear().type(testUser.name);
        cy.get(locators.signup.EMAIL).clear().type(testUser.email);
        cy.get(locators.signup.PASSWORD).clear().type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD)
            .clear()
            .type(testUser.password);
        cy.checkRecaptcha();

        cy.intercept("POST", "/api/user/register", (req) => {
            req.continue((res) => {
                if (res.statusCode >= 400) {
                    cy.log(
                        `Registration failed: ${
                            res.statusCode
                        } - ${JSON.stringify(res.body)}`
                    );
                }
            });
        }).as("registerUser");
        cy.intercept("/api/.ory/sessions/whoami").as("confirmLogin");

        cy.get(locators.signup.BTN_SUBMIT).click();

        cy.wait("@registerUser", { timeout: TIMEOUT.API }).then(
            (interception) => {
                const isSuccess = [200, 201].includes(
                    interception.response.statusCode
                );
                if (!isSuccess) {
                    cy.log(
                        `Registration API Error: ${interception.response.statusCode}`
                    );
                    cy.log(
                        `Error body: ${JSON.stringify(
                            interception.response.body
                        )}`
                    );
                    expect(interception.response.statusCode).to.be.oneOf([
                        200, 201,
                    ]);
                }
            }
        );

        cy.wait("@confirmLogin", { timeout: TIMEOUT.API });

        cy.url({ timeout: TIMEOUT.API }).should("eq", "http://localhost:3000/");
        cy.get(
            ".ant-message-success, .MuiAlert-standardSuccess, [role='alert']",
            { timeout: TIMEOUT.DEFAULT }
        ).should("exist");
    });
});
