import user from "../fixtures/user";
import locators from "./locators";

Cypress.Commands.add('login', () => {
    cy.visit("http://localhost:3000/login");
    cy.get(locators.login.USER).type(user.email);
    cy.get(locators.login.PASSWORD).type(user.password);
    cy.get(locators.login.BTN_LOGIN).click();
    cy.intercept("/api/.ory/sessions/whoami").as("confirmLogin");
    cy.wait("@confirmLogin", { timeout: 10000 });
})

Cypress.Commands.add('checkRecaptcha', () => {

    const getIframeDocument = () => {
        return cy
            .get('[title="reCAPTCHA"]')
            // Cypress yields jQuery element, which has the real
            // DOM element under property "0".
            .its('0.contentDocument').should('exist')
    }


    const getIframeBody = () => {
        return getIframeDocument()
            // automatically retries until body is not empty or fails with timeout
            .its('body').should('not.be.empty')
            // wraps "body" DOM element to allow
            // chaining more Cypress commands, like ".find(...)"
            .then(cy.wrap)
    }

    getIframeBody().find("#recaptcha-anchor").click();
});

declare global {
    namespace Cypress {
        interface Chainable {
            login(): Chainable<Element>,
            checkRecaptcha(): Chainable<Element>
        }
    }
}
