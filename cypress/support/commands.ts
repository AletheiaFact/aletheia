import dayjs from "dayjs";
import user from "../fixtures/user";
import locators from "./locators";

Cypress.Commands.add("goToLoginPage", () => {
    cy.visit("http://localhost:3000");
    cy.title().should("contain", "AletheiaFact.org");
    cy.get(locators.menu.USER_ICON).click();
    cy.get(locators.menu.LOGIN_MENU).click();
    cy.url().should("contains", "login");
});

Cypress.Commands.add("login", () => {
    cy.goToLoginPage();
    cy.get(locators.login.USER).type(user.email);
    cy.get(locators.login.PASSWORD).type(user.password);
    cy.get(locators.login.BTN_LOGIN).click();
    cy.intercept("/api/.ory/sessions/whoami").as("confirmLogin");
    cy.wait("@confirmLogin", { timeout: 30000 });
    // The tutorial modal will show up in the home page after the login
    cy.get(`${locators.claim.BTN_OK_TUTORIAL}`).should("be.visible").click();
});

Cypress.Commands.add("checkRecaptcha", () => {
    const getIframeBody = () => {
        // get the iframe > document > body
        // and retries until the body is not empty or fails with timeout
        return cy
            .get('iframe[title="reCAPTCHA"]', { timeout: 10000 })
            .its("0.contentDocument.body")
            .should("not.be.empty")
            .then(cy.wrap);
    };

    getIframeBody()
        .find("#recaptcha-anchor", { timeout: 10000 })
        .should("be.visible")
        .click({ force: true });

    cy.wait(500);
});

Cypress.Commands.add("goToSignUpPage", () => {
    cy.visit("http://localhost:3000/sign-up");
    cy.url().should("contains", "sign-up");
});

Cypress.Commands.add(
    "signup",
    (name: string, email: string, password: string) => {
        cy.goToSignUpPage();
        cy.get(locators.signup.NAME).type(name);
        cy.get(locators.signup.EMAIL).type(email);
        cy.get(locators.signup.PASSWORD).type(password);
        cy.get(locators.signup.REPEATED_PASSWORD).type(password);
        cy.checkRecaptcha();
        cy.get(locators.signup.BTN_SUBMIT).click();
    }
);

Cypress.Commands.add("selectDatePickerDate", (dateToSelect: dayjs.Dayjs) => {
    const today = dayjs();

    cy.get(locators.claim.INPUT_DATA).click();

    if (dateToSelect.month() < today.month() || dateToSelect.year() < today.year()) {
        cy.get('[aria-label="Previous month"]').click();
    } else if (dateToSelect.month() > today.month() || dateToSelect.year() > today.year()) {
        cy.get('[aria-label="Next month"]').click();
    }

    cy.contains('[role="gridcell"]', dateToSelect.format("D")).click();
});

declare global {
    namespace Cypress {
        interface Chainable {
            login(): Chainable<Element>;
            checkRecaptcha(): Chainable<Element>;
            goToLoginPage(): Chainable<Element>;
            goToSignUpPage(): Chainable<Element>;
            signup(
                name: string,
                email: string,
                password: string
            ): Chainable<Element>;
            selectDatePickerDate(date: dayjs.Dayjs): Chainable<Element>;
        }
    }
}
