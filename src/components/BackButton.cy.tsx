/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable<Subject = any> {
            mountWithRouter(component: React.ReactElement, options?: { pathname?: string }): Chainable<any>;
        }
    }
}

import React from "react";
import BackButton from "../../src/components/BackButton";

describe("BackButton Component", () => {
    describe("should not render on home page or root path", () => {

        beforeEach(() => {
            cy.stub(require("next-i18next"), "useTranslation").returns({
                t: (key: string) => key,
            });
        });

        it("should render and handle callback", () => {
            const callbackSpy = cy.spy().as("callbackSpy");

            cy.mountWithRouter(
                <BackButton callback={callbackSpy} isVisible={true} />
            );

            cy.get('[data-cy="testBackButton"]')
                .should("be.visible")
                .click();

            cy.get("@callbackSpy").should("have.been.calledOnce");
        });

        it("should call router.back when no callback is provided", () => {
            cy.mountWithRouter(<BackButton isVisible={true} />).then((router) => {
                cy.get('[data-cy="testBackButton"]').click();
                cy.wrap(router.back).should("have.been.calledOnce");
            });
        });

        it("should not render when isVisible is false", () => {
            cy.mountWithRouter(<BackButton isVisible={false} />);

            cy.get('[data-cy="testBackButton"]').should("not.exist");
        });

        it("should not render on the root path", () => {
            cy.mountWithRouter(<BackButton isVisible={true} />, {
                pathname: "/",
            });

            cy.get('[data-cy="testBackButton"]').should("not.exist");
        });

        it("should not render on the home page path", () => {
            cy.mountWithRouter(<BackButton isVisible={true} />, {
                pathname: "/home-page",
            });

            cy.get('[data-cy="testBackButton"]').should("not.exist");
        });
    });
});