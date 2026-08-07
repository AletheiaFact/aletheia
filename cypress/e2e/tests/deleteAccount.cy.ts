/// <reference types="cypress" />

import locators from "../../support/locators";

/**
 * Self-service account deletion (DELETE /api/me).
 *
 * The test creates its OWN throwaway user and deletes it, so it never touches
 * the shared seeded `test-cypress` account that the other specs log in with.
 */
describe("Delete account", () => {
    const TIMEOUT = { DEFAULT: 10000, API: 30000 };
    const baseUrl = Cypress.config("baseUrl") || "http://localhost:3000";

    const throwawayUser = {
        name: "Delete Me",
        email: `delete-me-${Date.now()}@aletheiafact.org`,
        password: "TestPassword123!",
    };

    const dismissTutorialIfPresent = () => {
        cy.get("body").then(($body) => {
            if ($body.find(locators.claim.BTN_OK_TUTORIAL).length) {
                cy.get(locators.claim.BTN_OK_TUTORIAL).click({ force: true });
            }
        });
    };

    it("lets a signed-in user permanently delete their own account", () => {
        // --- Create a throwaway account (sign-up auto-logs the user in) ---
        cy.intercept("POST", "/api/user/register").as("registerUser");
        cy.intercept("/api/.ory/sessions/whoami").as("confirmLogin");

        cy.signup(
            throwawayUser.name,
            throwawayUser.email,
            throwawayUser.password
        );

        cy.wait("@registerUser", { timeout: TIMEOUT.API })
            .its("response.statusCode")
            .should("be.oneOf", [200, 201]);
        cy.wait("@confirmLogin", { timeout: TIMEOUT.API });
        cy.url({ timeout: TIMEOUT.API }).should("eq", `${baseUrl}/`);
        dismissTutorialIfPresent();

        // --- Navigate to the profile page ---
        cy.get(locators.header.OPEN_USER_MENU).click();
        cy.get(locators.header.PROFILE_ITEM).click();
        cy.url({ timeout: TIMEOUT.API }).should("include", "/profile");

        // --- Open the delete-account confirmation modal ---
        cy.get(locators.profile.OPEN_DELETE_ACCOUNT).click();

        // Confirm button stays disabled until the typed value matches the email
        cy.get(locators.profile.DELETE_CONFIRM_BTN).should("be.disabled");
        cy.get(locators.profile.DELETE_CONFIRM_INPUT).type("not-my-email");
        cy.get(locators.profile.DELETE_CONFIRM_BTN).should("be.disabled");
        cy.get(locators.profile.DELETE_CONFIRM_INPUT)
            .clear()
            .type(throwawayUser.email);
        cy.get(locators.profile.DELETE_CONFIRM_BTN).should("not.be.disabled");

        // --- Delete the account ---
        cy.intercept("DELETE", "/api/me").as("deleteAccount");
        cy.get(locators.profile.DELETE_CONFIRM_BTN).click();

        cy.wait("@deleteAccount", { timeout: TIMEOUT.API })
            .its("response.statusCode")
            .should("eq", 200);

        // --- After deletion the user is logged out and sent home ---
        cy.url({ timeout: TIMEOUT.API }).should("eq", `${baseUrl}/`);
        dismissTutorialIfPresent();
        cy.get(locators.header.OPEN_USER_MENU).click();
        cy.get(locators.header.LOGIN_ITEM).should("be.visible");

        // --- The identity is erased: logging back in fails ---
        cy.intercept("POST", "/api/.ory/self-service/login**").as(
            "loginRequest"
        );
        cy.goToLoginPage();
        cy.get(locators.login.USER).type(throwawayUser.email);
        cy.get(locators.login.PASSWORD).type(throwawayUser.password);
        cy.get(locators.login.BTN_LOGIN).click();
        cy.wait("@loginRequest", { timeout: TIMEOUT.API })
            .its("response.statusCode")
            .should("eq", 400);
        cy.contains("Erro ao fazer login").should("be.visible");
    });
});
