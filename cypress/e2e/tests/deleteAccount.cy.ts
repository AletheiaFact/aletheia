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

        // The first-visit tutorial modal only renders for a logged-in user with
        // no `tutorial_shown` cookie (see AffixButton). It appears right after
        // sign-up and its backdrop covers the header menu, so dismiss it first.
        // Dismissing sets the cookie, and the user is logged out on deletion, so
        // it never reappears later in this test.
        cy.get(locators.claim.BTN_OK_TUTORIAL, { timeout: TIMEOUT.API })
            .should("be.visible")
            .click();
        cy.get(".MuiBackdrop-root").should("not.exist");

        // --- Navigate to the profile page ---
        cy.get(locators.header.OPEN_USER_MENU).click();
        cy.get(locators.header.PROFILE_ITEM).click();
        cy.url({ timeout: TIMEOUT.API }).should("include", "/profile");

        // --- Open the delete-account confirmation modal ---
        cy.get(locators.profile.OPEN_DELETE_ACCOUNT).click();

        // Regression (mobile): AletheiaModal used to put `align-self` on the
        // Dialog root. An absolutely positioned box with both block offsets set
        // stretches by default, so any other `align-self` made the fixed root
        // shrink-to-fit, leaving it auto-height. `.MuiDialog-container`
        // (height: 100%) and `.MuiDialog-paper` (max-height: calc(100% - 64px))
        // then resolved against an indefinite height; WebKit collapsed
        // `.MuiDialogContent-root` to zero and iOS Safari rendered a title-only
        // modal. Guard the invariant that broke: root fills the viewport and the
        // content actually has height.
        cy.viewport(390, 844);
        cy.get(".MuiDialog-root").should(($root) => {
            const root = $root[0].getBoundingClientRect();
            expect(root.height, "dialog root fills the viewport").to.be.closeTo(
                844,
                1
            );
        });
        cy.get(".MuiDialogContent-root").should(($content) => {
            expect(
                $content[0].getBoundingClientRect().height,
                "dialog content is not collapsed"
            ).to.be.greaterThan(0);
        });
        // The body copy, the email input and both buttons must all be reachable.
        cy.get(locators.profile.DELETE_CONFIRM_INPUT).should("be.visible");
        cy.get(locators.profile.DELETE_CONFIRM_BTN).should("be.visible");

        // ...and the confirm button must sit inside the paper, not overflow it.
        cy.get(".MuiDialog-paper").then(($paper) => {
            const paper = $paper[0].getBoundingClientRect();
            cy.get(locators.profile.DELETE_CONFIRM_BTN).should(($confirm) => {
                const confirm = $confirm[0].getBoundingClientRect();
                expect(confirm.right, "confirm button within paper").to.be.at.most(
                    paper.right + 1
                );
                expect(confirm.left, "confirm button within paper").to.be.at.least(
                    paper.left - 1
                );
            });
        });
        cy.viewport(1280, 900);

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
