/// <reference types="cypress" />

import React from "react";
import { mount } from "cypress/react18";
import CTAButton from "../../../src/components/Home/CTAButton";

describe("CTAButton Component", () => {

    it("Should open modal when logged in and click header button", () => {
        mount(<CTAButton isLoggedIn={true} location="header" />);

        cy.get("[data-cy=testCTAButton]").should("exist").click();
        cy.get("[data-cy=testAlertModalButton]").should("be.visible");
    });

    it("Should open modal when logged in and click folder button", () => {
        mount(<CTAButton isLoggedIn={true} location="folder" />);

        cy.get("[data-cy=testCTAButton]").click();
        cy.get("[data-cy=testAlertModalButton]").should("be.visible");
    });

    it("Should redirect sign up page when not logged in and click folder button", () => {
        mount(<CTAButton isLoggedIn={false} location="folder" />);

        cy.get("[data-cy=testCTAButton]")
            .should("exist")
            .should("have.attr", "href", "/sign-up")
    });

    it("Should redirect sign up page when not logged in", () => {
        mount(<CTAButton isLoggedIn={false} location="header" />);

        cy.get("[data-cy=testCTAButton]")
            .should("exist")
            .should("have.attr", "href", "/sign-up")
    });
});

