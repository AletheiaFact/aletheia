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
        cy.contains("Campo obrigatório").should("be.visible");
    });

    it("Should show validation error when email is invalid", () => {
        cy.get(locators.signup.NAME).type(testUser.name);
        cy.get(locators.signup.EMAIL).type("invalid-email");
        cy.get(locators.signup.PASSWORD).type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD).type(testUser.password);
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();
        cy.contains("E-mail inválido").should("be.visible");
    });

    it("Should show validation error when passwords don't match", () => {
        cy.get(locators.signup.NAME).type(testUser.name);
        cy.get(locators.signup.EMAIL).type(testUser.email);
        cy.get(locators.signup.PASSWORD).type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD).type("DifferentPassword123!");
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();
        cy.contains("senhas não são iguais").should("be.visible");
    });

    it("Should show error when CAPTCHA is not completed", () => {
        cy.get(locators.signup.NAME).type(testUser.name);
        cy.get(locators.signup.EMAIL).type(testUser.email);
        cy.get(locators.signup.PASSWORD).type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD).type(testUser.password);
        cy.get(locators.signup.BTN_SUBMIT).click();
        cy.contains("Campo obrigatório").should("be.visible");
    });

    it("Should successfully create account with valid data and CAPTCHA", () => {
        cy.get(locators.signup.NAME).type(testUser.name);
        cy.get(locators.signup.EMAIL).type(testUser.email);
        cy.get(locators.signup.PASSWORD).type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD).type(testUser.password);
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();

        // After successful registration, user should be redirected to home
        cy.url().should("eq", "http://localhost:3000/");
        cy.contains("Cadastro realizado com sucesso").should("be.visible");
    });

    it("Should show error when email already exists", () => {
        cy.get(locators.signup.NAME).type("Duplicate User");
        cy.get(locators.signup.EMAIL).type("existing@aletheiafact.org");
        cy.get(locators.signup.PASSWORD).type(testUser.password);
        cy.get(locators.signup.REPEATED_PASSWORD).type(testUser.password);
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();

        cy.contains(/usuário já existe|já cadastrado/i).should("be.visible");
    });
});
