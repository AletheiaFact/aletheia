/// <reference types="cypress" />

import React from "react";
import { mount } from "cypress/react18";
import BackButton from "../../src/components/BackButton";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";

const createMockRouter = (overrides = {}) => ({
    pathname: "/test-page",
    route: "/test-page",
    query: {},
    asPath: "/test-page",
    push: cy.stub(),
    replace: cy.stub(),
    prefetch: cy.stub().resolves(),
    back: cy.stub(),
    events: {
        on: cy.stub(),
        off: cy.stub(),
        emit: cy.stub(),
    },
    isReady: true,
    basePath: "",
    isLocaleDomain: false,
    ...overrides,
});

const mountWithRouter = (component: React.ReactNode, routerOverrides = {}) => {
    const router = createMockRouter(routerOverrides);

    return mount(
        <RouterContext.Provider value={router}>
            {component}
        </RouterContext.Provider>
    ).then(() => router);
};

describe("BackButton Component", () => {
    describe("should not render on home page or root path", () => {

        beforeEach(() => {
            cy.stub(require("next-i18next"), "useTranslation").returns({
                t: (key: string) => key,
            });
        });

        it("should render and handle callback", () => {
            const callbackSpy = cy.spy().as("callbackSpy");

            mountWithRouter(
                <BackButton callback={callbackSpy} isVisible={true} />
            );

            cy.get('[data-cy="testBackButton"]')
                .should("be.visible")
                .click();

            cy.get("@callbackSpy").should("have.been.calledOnce");
        });

        it("should call router.back when no callback is provided", () => {
            mountWithRouter(<BackButton isVisible={true} />).then((router) => {
                cy.get('[data-cy="testBackButton"]').click();
                cy.wrap(router.back).should("have.been.calledOnce");
            });
        });

        it("should not render when isVisible is false", () => {
            mountWithRouter(<BackButton isVisible={false} />);

            cy.get('[data-cy="testBackButton"]').should("not.exist");
        });

        it("should not render on the root path", () => {
            mountWithRouter(<BackButton isVisible={true} />, {
                pathname: "/",
            });

            cy.get('[data-cy="testBackButton"]').should("not.exist");
        });

        it("should not render on the home page path", () => {
            mountWithRouter(<BackButton isVisible={true} />, {
                pathname: "/home-page",
            });

            cy.get('[data-cy="testBackButton"]').should("not.exist");
        });
    });
});