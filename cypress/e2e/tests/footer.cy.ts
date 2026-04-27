/// <reference types="cypress" />

import locators from "../../support/locators";

describe("Footer Navigation", () => {
    const expectInternalNavigation = (selector: string, expectedPath: string) => {
        cy.get(selector).should("be.visible").click();
        cy.url().should("include", expectedPath);
    };

    const expectExternalLink = (selector: string, expectedHref: string, target = "_blank") => {
        cy.get(selector)
            .should("be.visible")
            .and("have.attr", "href", expectedHref)
            .and("have.attr", "target", target)
            .click({ force: true });
    };

    const expectMailtoLink = (selector: string, expectedEmail: string) => {
        cy.get(selector)
            .should("be.visible")
            .invoke("attr", "href")
            .should("match", /^mailto:/)
            .and("include", expectedEmail);
    };

    beforeEach(() => {
        cy.visit("/");
        cy.get("footer").scrollIntoView();
    });

    it("validates CTA links", () => {
        cy.get("body").then(($body) => {
            if ($body.find(locators.footer.CTA_PRIMARY).length > 0) {
                expectInternalNavigation(locators.footer.CTA_PRIMARY, "/about");
            }
        });

        cy.visit("/");
        cy.get("footer").scrollIntoView();

        cy.get("body").then(($body) => {
            if ($body.find(locators.footer.CTA_SECONDARY).length > 0) {
                expectExternalLink(locators.footer.CTA_SECONDARY, "https://forms.gle/AnTuCzXtPTrsXHGVA");
            }
        });
    });

    it("validates social links", () => {
        expectExternalLink(locators.footer.SOCIAL_INSTAGRAM, "https://www.instagram.com/aletheiafact");
        expectExternalLink(locators.footer.SOCIAL_FACEBOOK, "https://www.facebook.com/AletheiaFactorg-107521791638412");
        expectExternalLink(locators.footer.SOCIAL_LINKEDIN, "https://www.linkedin.com/company/aletheiafact-org");
        expectExternalLink(locators.footer.SOCIAL_GITHUB, "https://github.com/AletheiaFact/aletheia");
    });

    it("validates platform links", () => {
        cy.get(locators.footer.PLATFORM_ACCESS)
            .should("be.visible")
            .and("have.attr", "href")
            .and("include", "/");

        expectInternalNavigation(locators.footer.PLATFORM_ACCESS, "/");

        cy.visit("/");
        cy.get("footer").scrollIntoView();
        expectExternalLink(locators.footer.PLATFORM_MANUAL, "https://aletheiafact-supportive-materials.s3.amazonaws.com/Manual+de+Checagem.pdf");

        cy.visit("/");
        cy.get("footer").scrollIntoView();
        expectExternalLink(locators.footer.PLATFORM_DOCS, "https://docs.aletheiafact.org");
    });

    it("validates institutional links", () => {
        expectInternalNavigation(locators.footer.INSTITUTIONAL_ABOUT, "/about");

        cy.visit("/");
        cy.get("footer").scrollIntoView();
        expectInternalNavigation(locators.footer.INSTITUTIONAL_PARTNERS, "/about#partners-section");

        cy.visit("/");
        cy.get("footer").scrollIntoView();
        expectInternalNavigation(locators.footer.INSTITUTIONAL_AWARDS, "/about#awards-section");
    });

    it.only("validates community links", () => {
        expectMailtoLink(locators.footer.COMMUNITY_COLLABORATION, "tvolcean@aletheiafact.org");

        expectInternalNavigation(locators.footer.COMMUNITY_UNIVERSITIES, "/about#partners-section");

        cy.visit("/");
        cy.get("footer").scrollIntoView();
        expectExternalLink(
            locators.footer.COMMUNITY_VOLUNTEERING,
            "https://docs.google.com/forms/d/1O1e-zIDj2aJIAmuNIfO5T4VznenuYfHMTlFB8L_sFG4/viewform?ts=69b97c51&edit_requested=true",
            "_self"
        );
    });

    it("validates statute and legal links", () => {
        cy.get("body").then(($body) => {
            if ($body.find(locators.footer.STATUTE).length > 0) {
                expectExternalLink(
                    locators.footer.STATUTE,
                    "https://docs.google.com/viewer?url=https://raw.githubusercontent.com/AletheiaFact/miscellaneous/290b19847f0da521963f74e7947d7863bf5d5624/documents/org_legal_register.pdf"
                );
            }
        });

        expectExternalLink(
            locators.footer.CREATIVE_COMMONS,
            "https://creativecommons.org/licenses/by-sa/4.0/"
        );
    });
});
