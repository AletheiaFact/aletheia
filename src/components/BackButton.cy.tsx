/// <reference types="cypress" />

import React from "react";
import { mount } from "cypress/react";
import BackButton from "../../src/components/BackButton";

describe("BackButton Component", () => {
    it("should render and handle callback", () => {
        const callbackSpy = cy.spy().as("callbackSpy");

        mount(<BackButton callback={callbackSpy} isVisible={true} />);

        cy.get('[data-cy="testBackButton"]').should("be.visible").click();
        cy.get("@callbackSpy").should("have.been.calledOnce");
    });

    it("should call router.back when no callback is provided", () => {
        const routerBackSpy = cy.spy().as("routerBackSpy");

        cy.stub(require("next/router"), "useRouter").returns({
            pathname: "/another-page",
            back: routerBackSpy,
        });

        mount(<BackButton isVisible={true} />);

        cy.get('[data-cy="testBackButton"]').click();
        cy.get("@routerBackSpy").should("have.been.calledOnce");
    });

    it("should not render when isVisible is false", () => {
        mount(<BackButton isVisible={false} />);

        cy.get('[data-cy="testBackButton"]').should("not.exist");
    });

    describe("should not render on home page or root path", () => {
        const mockRouter = (pathname: string) => {
            cy.stub(require("next/router"), "useRouter").returns({
                pathname,
                route: pathname,
                query: {},
                asPath: pathname,
                push: cy.stub(),
                replace: cy.stub(),
                prefetch: cy.stub().resolves(),
            });
        };

        it("should not render on the root path", () => {
            mockRouter("/");
            mount(<BackButton isVisible={true} />);
            cy.get('[data-cy="testBackButton"]').should("not.exist");
        });

        it("should not render on the home page path", () => {
            mockRouter("/home-page");
            mount(<BackButton isVisible={true} />);
            cy.get('[data-cy="testBackButton"]').should("not.exist");
        });
    });
});
