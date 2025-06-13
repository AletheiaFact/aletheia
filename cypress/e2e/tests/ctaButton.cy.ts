describe("CTA Button Tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000");
    });

    it("Should enter sign up page", () => {
        cy.get("[data-cy=testCTAButton]").first().click();
    });

    it("Should redict to forum when logged in", () => {
        cy.login();
        cy.get("[data-cy=testCTAButton]").first().click();
        cy.get("[data-cy=testAlertModalButton]").should("be.visible").click();
    });
});
