/* eslint-disable no-undef */
/// <reference types="cypress" />

import locators from "../../../support/locators";

describe("Sign Up tests", () => {
    const testUser = {
        name: "Test User",
        email: `test${Date.now()}@aletheiafact.org`,
        password: "TestPassword123!",
    };

    beforeEach(() => {
        cy.goToSignUpPage();
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
        cy.get(locators.signup.EMAIL).type(testUser.email);
        cy.get(locators.signup.PASSWORD).type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD).type(testUser.password);
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();
        cy.get(locators.signup.ERROR_NAME).should("be.visible");
        cy.get(locators.signup.ERROR_NAME).should(
            "contain",
            "Please, insert your name"
        );
    });

    it("Should show validation error when email is invalid", () => {
        cy.get(locators.signup.NAME).type(testUser.name);
        cy.get(locators.signup.EMAIL).type("invalid-email");
        cy.get(locators.signup.PASSWORD).type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD).type(testUser.password);
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();
        cy.get(locators.signup.ERROR_EMAIL).should("be.visible");
        cy.get(locators.signup.ERROR_EMAIL).should("contain", "Invalid e-mail");
    });

    it("Should show validation error when passwords don't match", () => {
        cy.get(locators.signup.NAME).type(testUser.name);
        cy.get(locators.signup.EMAIL).type(testUser.email);
        cy.get(locators.signup.PASSWORD).type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD).type("DifferentPassword123!");
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();
        cy.get(locators.signup.ERROR_REPEATED_PASSWORD).should("be.visible");
        cy.get(locators.signup.ERROR_REPEATED_PASSWORD).should(
            "contain",
            "The two passwords that you entered do not match"
        );
    });

    it("Should show error when CAPTCHA is not completed", () => {
        cy.get(locators.signup.NAME).type(testUser.name);
        cy.get(locators.signup.EMAIL).type(testUser.email);
        cy.get(locators.signup.PASSWORD).type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD).type(testUser.password);
        cy.get(locators.signup.BTN_SUBMIT).click();
        cy.contains("Field is required").should("be.visible");
    });

    it("Should successfully create account with valid data and CAPTCHA", () => {
        cy.get(locators.signup.NAME).type(testUser.name);
        cy.get(locators.signup.EMAIL).type(testUser.email);
        cy.get(locators.signup.PASSWORD).type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD).type(testUser.password);
        cy.checkRecaptcha();

        // Intercept the registration API call
        cy.intercept("POST", "/api/user/register").as("registerUser");
        cy.intercept("/api/.ory/sessions/whoami").as("confirmLogin");

        cy.get(locators.signup.BTN_SUBMIT).click();

        // Wait for registration to complete
        cy.wait("@registerUser", { timeout: 30000 });
        cy.wait("@confirmLogin", { timeout: 30000 });

        // After successful registration, user should be redirected to home
        cy.url({ timeout: 30000 }).should("eq", "http://localhost:3000/");
        cy.contains("Sign-up successful").should("be.visible");
    });
});
