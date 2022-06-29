import locators from "./locator";

Cypress.Commands.add('login', () => {
    cy.visit("http://localhost:3000/login");
    cy.get(locators.LOGIN.USER).type("test@aletheiafact.org");
    cy.get(locators.LOGIN.PASSWORD).type("TEST_USER_PASS");
    cy.get(locators.LOGIN.BTN_LOGIN).click();
})

Cypress.Commands.add('checkRecaptcha', () => {
    cy.get("iframe").then((iframe) => {
        const body = iframe.contents().find("body");
        cy.wrap(body).find("#recaptcha-anchor").click();
    });
})

declare global {
    namespace Cypress {
        interface Chainable {
            login(): Chainable<Element>,
            checkRecaptcha(): Chainable<Element>
        }
    }
}
