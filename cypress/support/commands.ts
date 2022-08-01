import user from "../fixtures/user";
import locators from "./locators";

Cypress.Commands.add("login", () => {
    cy.visit("http://localhost:3000");
    cy.title().should("contain", "AletheiaFact.org");
    cy.visit("http://localhost:3000/login");
    cy.get(locators.login.USER).type(user.email);
    cy.get(locators.login.PASSWORD).type(user.password);
    cy.get(locators.login.BTN_LOGIN).click();
    cy.intercept("/api/.ory/sessions/whoami").as("confirmLogin");
    cy.wait("@confirmLogin", { timeout: 10000 });
});

Cypress.Commands.add("checkRecaptcha", () => {
    const getIframeBody = () => {
        // get the iframe > document > body
        // and retries until the body is not empty or fails with timeout
        return cy
            .get('iframe[title="reCAPTCHA"]')
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap);
    };

    getIframeBody().find("#recaptcha-anchor").click();
});

declare global {
    namespace Cypress {
        interface Chainable {
            login(): Chainable<Element>;
            checkRecaptcha(): Chainable<Element>;
        }
    }
}
