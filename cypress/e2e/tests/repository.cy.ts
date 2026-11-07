/// <reference types="cypress" />

import repository from "../../fixtures/repository";
import locators from "../../support/locators";

const { repository: page } = locators;
// The list endpoints only; /api/claim/:id and /api/review/:hash differ
const CLAIM_LIST = /\/api\/claim\/?\?/;
const REVIEW_LIST = /\/api\/review\/?\?/;

// The list endpoints send Cache-Control: max-age=60, so a repeated URL (a
// reload, or the next test's first visit) would be answered from the
// browser cache and never reach cy.intercept. Spy without caching.
const spyWithoutCache = (url: RegExp) =>
    cy.intercept({ method: "GET", url }, (req) =>
        req.continue((res) => {
            res.headers["cache-control"] = "no-store";
        })
    );

// Waits for the next list request and checks the API accepted it: the list
// schemas are strict, so a filter the frontend sends wrong comes back 400.
const expectListRequest = (alias: string, query: Record<string, string>) =>
    cy.wait(alias).then(({ request, response }) => {
        expect(response?.statusCode).to.eq(200);
        const params = new URL(request.url).searchParams;
        Object.entries(query).forEach(([key, value]) =>
            expect(params.getAll(key)).to.include(value)
        );
    });

describe("Repository page", () => {
    beforeEach(() => {
        spyWithoutCache(CLAIM_LIST).as("listClaims");
    });

    describe("claims tab", () => {
        it("lists claims and keeps the filters in the URL", () => {
            cy.visit("/claim");
            expectListRequest("@listClaims", { sortBy: "date" });
            cy.get(page.TOTAL).should("be.visible");

            cy.get(page.CONTENT_MODEL("Speech")).check();
            expectListRequest("@listClaims", { "contentModel[]": "Speech" });
            cy.location("search").should("include", "contentModel=Speech");

            cy.get(page.REVIEW_STATUS("without")).click();
            expectListRequest("@listClaims", { reviewStatus: "without" });
            cy.location("search").should("include", "reviewStatus=without");

            cy.reload();
            expectListRequest("@listClaims", {
                "contentModel[]": "Speech",
                reviewStatus: "without",
            });
            cy.get(page.CONTENT_MODEL("Speech")).should("be.checked");
            cy.get(page.REVIEW_STATUS("without")).should(
                "have.class",
                "Mui-selected"
            );

            cy.get(page.CLEAR_FILTERS).click();
            cy.location("search").should("eq", "");
            cy.get(page.CONTENT_MODEL("Speech")).should("not.be.checked");
        });

        it("shows the empty state for a search without results", () => {
            cy.visit("/claim");
            cy.wait("@listClaims");

            cy.get(page.SEARCH).type(repository.unknownSearch);
            expectListRequest("@listClaims", { q: repository.unknownSearch });
            cy.get(page.EMPTY).should("be.visible");
            cy.get(page.RESULTS).should("not.exist");

            cy.get(page.EMPTY_CLEAR).click();
            cy.get(page.SEARCH).should("have.value", "");
            cy.location("search").should("eq", "");
        });
    });

    describe("fact-checks tab", () => {
        it("lists fact-checks and filters by methodology and classification", () => {
            cy.intercept(
                { method: "GET", url: REVIEW_LIST },
                { body: repository.reviews }
            ).as("listReviews");
            cy.visit("/claim");

            cy.get(page.REVIEWS_TAB).click();
            expectListRequest("@listReviews", { withCounts: "true" });
            cy.location("search").should("include", "tab=reviews");
            cy.get(`${page.RESULTS} [data-cy=testReviewCardContainer]`).should(
                "have.length",
                2
            );
            cy.get(page.CLASSIFICATIONS).should("have.length", 9);

            cy.get(page.METHODOLOGY("rncd-debate")).click();
            expectListRequest("@listReviews", {
                classificationMethodology: "rncd-debate",
            });
            cy.get(page.CLASSIFICATIONS).should("have.length", 4);

            cy.get(page.CLASSIFICATION("false")).check();
            expectListRequest("@listReviews", { "classification[]": "false" });
            cy.location("search")
                .should("include", "methodology=rncd-debate")
                .and("include", "classification=false");

            // A second click clears the methodology
            cy.get(page.METHODOLOGY("rncd-debate")).click();
            cy.get(page.CLASSIFICATIONS).should("have.length", 9);
        });

        it("sends filters the reviews API accepts", () => {
            spyWithoutCache(REVIEW_LIST).as("listReviews");
            cy.visit(
                "/claim?tab=reviews&methodology=rncd-debate&classification=false&contentModel=Debate&startDate=2026-01-01&endDate=2026-12-31"
            );
            expectListRequest("@listReviews", {
                classificationMethodology: "rncd-debate",
                "classification[]": "false",
                "contentModel[]": "Debate",
            });
            cy.get(page.METHODOLOGY("rncd-debate")).should(
                "have.class",
                "Mui-selected"
            );
        });
    });

    describe("on a phone", () => {
        beforeEach(() => cy.viewport("iphone-x"));

        it("moves the filters into a drawer", () => {
            cy.visit("/claim");
            cy.wait("@listClaims");
            cy.get(page.FILTERS).should("not.exist");

            cy.get(page.OPEN_FILTERS).click();
            cy.get(page.CONTENT_MODEL("Debate")).check();
            expectListRequest("@listClaims", { "contentModel[]": "Debate" });

            cy.get(page.APPLY_FILTERS).click();
            cy.get(page.FILTERS).should("not.exist");
            cy.location("search").should("include", "contentModel=Debate");
        });
    });
});
