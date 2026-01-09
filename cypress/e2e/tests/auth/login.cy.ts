import user from "../../../fixtures/user";
import locators from "../../../support/locators";

describe("Login tests", () => {
    const submitLoginForm = (email, password) => {
        cy.get(locators.login.USER).type(email);
        cy.get(locators.login.PASSWORD).type(password);
        cy.get(locators.login.BTN_LOGIN).click();
    };

    it("Should login with valid credentials", () => {
        cy.login();
    });

    it("Should not login with invalid password", () => {
        cy.intercept("POST", "/api/.ory/self-service/login**").as(
            "loginRequest"
        );
        cy.goToLoginPage();
        submitLoginForm(user.email, "invalidPassword123");
        cy.wait("@loginRequest").its("response.statusCode").should("eq", 400);
        cy.contains("Erro ao fazer login").should("be.visible");
    });

    it("Should not login with invalid email", () => {
        cy.intercept("POST", "/api/.ory/self-service/login**").as(
            "loginRequest"
        );
        cy.goToLoginPage();
        submitLoginForm("invalidEmail@alethieiafact.org", user.password);
        cy.wait("@loginRequest").its("response.statusCode").should("eq", 400);
        cy.contains("Erro ao fazer login").should("be.visible");
    });

    it("Should logout successfully", () => {
        cy.login();
        cy.intercept("/api/.ory/sessions/whoami").as("confirmLogout");
        cy.get(locators.menu.USER_ICON).click();
        cy.get(locators.menu.LOGOUT_MENU).click();
        cy.wait("@confirmLogout", { timeout: 30000 });
        cy.get(locators.menu.USER_ICON).click();
        cy.get(locators.menu.LOGIN_MENU).should("be.visible");
    });
});
