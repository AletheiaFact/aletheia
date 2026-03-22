/// <reference types="cypress" />

import claim from "../../fixtures/claim";
import { minimumContent } from "../../fixtures/verificationRequest";
import locators from "../../support/locators";
import { getFutureDay, getPastDay, today } from "../../utils/dateUtils";
import { formatMonthYear } from "../../../src/helpers/formatTimeAgo";

describe("Test events infrastructure", () => {
    const routes = {
        listPage: "/event",
        createPage: "/event/create",
    };

    const topic = {
        name: "Conferência das Nações Unidas sobre as Mudanças Climáticas de 2025",
        value: "Q115323194",
        aliases: ["COP30"],
        matchedAlias: "COP30",
    };

    let createdEventUrl = "";

    const buildEvent = (overrides = {}) => {
        return {
            badge: "COP30",
            name: topic.name,
            description: "E2E test event description",
            location: "Belém, Brasil",
            startDate: today.toISOString(),
            endDate: getFutureDay(2).toISOString(),
            mainTopic: topic,
            filterTopics: [],
            ...overrides,
        };
    };

    const openCreateEventForm = () => {
        cy.get(locators.floatButton.FLOAT_BUTTON).click();
        cy.get(locators.floatButton.ADD_EVENT).click();
        cy.url().should("contain", routes.createPage);
    };

    const fillEventForm = (startDate, endDate, overrides = {}) => {
        const event = buildEvent(overrides);

        cy.get(locators.event.FORM_BADGE).type(`{selectall}{backspace}${event.badge}`);
        cy.get(locators.event.FORM_NAME).type(`{selectall}{backspace}${event.name}`);
        cy.get(locators.event.FORM_DESCRIPTION).type(`{selectall}{backspace}${event.description}`);
        cy.get(locators.event.FORM_LOCATION).type(`{selectall}{backspace}${event.location}`);

        cy.selectDatePickerDate(0, startDate);
        cy.wait(500);
        cy.selectDatePickerDate(1, endDate);

        cy.intercept("GET", "**/api/topics/?topicName=*").as("searchTopics");
        cy.get(locators.event.FORM_MAIN_TOPIC).type(`{selectall}{backspace}${event.mainTopic.aliases[0]}`, { delay: 200 });
        cy.wait("@searchTopics");
        cy.contains(event.mainTopic.name).should("be.visible").click();
    };

    const saveEvent = () => {
        cy.checkRecaptcha();
        cy.get(locators.event.SAVE_BUTTON).click();
    };

    const addTopicFlow = (aliasType, labelToClick) => {
        cy.get(locators.topic.ADD_TOPIC_ICON).click();
        cy.get(locators.topic.TYPE_TOPIC_INPUT).type(aliasType, { delay: 200 });

        cy.contains(labelToClick).should("be.visible").click();

        cy.get(locators.topic.ADD_TOPIC_SUBMIT).click();

        cy.wait("@postTopic").then((interception) => {
            expect(interception.response.statusCode).to.be.oneOf([200, 201]);
        });
    };

    describe("event creation", () => {
        beforeEach(() => {
            cy.login();
            cy.intercept("POST", "**/api/topics/**").as("postTopic");
        });

        it("should prevent submission when required fields are missing", () => {
            openCreateEventForm();
            saveEvent();

            cy.get(locators.event.ERROR_VALIDATION_NAME).should("be.visible");
            cy.get(locators.event.ERROR_VALIDATION_MAIN_TOPIC).should("be.visible");
            cy.url().should("contain", routes.createPage);
        });

        it("should show validation error when endDate is before startDate", () => {
            openCreateEventForm();

            const start = getFutureDay(10);
            const end = getFutureDay(5);

            fillEventForm(start, end);
            saveEvent()

            cy.contains("A data de término não pode ser anterior à data de início").should("be.visible");

            cy.url().should("contain", routes.createPage);
        });

        it("should create an event successfully (happy path)", () => {
            cy.intercept("POST", "**/api/event/").as("createEvent");
            const event = buildEvent();

            openCreateEventForm();
            fillEventForm(today, getFutureDay(2));
            saveEvent();

            cy.wait("@createEvent").then((interception) => {
                expect(interception.response.statusCode).to.be.oneOf([200, 201]);
                const { data_hash, slug } = interception.response.body;

                createdEventUrl = `/event/${data_hash}/${slug}`;
                cy.url().should("contain", createdEventUrl);
                cy.get(locators.event.DETAIL_TITLE).should("be.visible").and("contain", event.name);
            });
        });
    });

    describe("Topic integration tests in claims to be linked", () => {
        beforeEach(() => {
            cy.login();
            cy.intercept("POST", "**/api/topics/**").as("postTopic");
        });

        it("should add topics to a checked claim sentence", () => {
            cy.get(`${locators.personality.SELECT_PERSONALITY} > *`)
                .should("be.visible")
                .first()
                .click();

            cy.get("[data-cy=testSeeFullSpeech]").first().click();
            cy.get("[data-cy=frase1]").click();
            cy.get(locators.claim.BTN_SEE_FULL_REVIEW).should("exist");

            addTopicFlow(topic.aliases[0], topic.name);
        });

        it("should add topics to a verification request", () => {
            cy.get(locators.menu.SIDE_MENU).click();
            cy.get("[data-cy=testVerificationRequestItem]").click();
            cy.contains(minimumContent).click();

            addTopicFlow(topic.aliases[0], topic.name);
        });

        it("should add topics to an unchecked claim image", () => {
            cy.visit(`/claim/${claim.imageSlug}`);
            cy.get(locators.claimReview.BTN_REVIEW_CLAIM_IMAGE).click();

            addTopicFlow(topic.aliases[0], topic.name);
        });
    });

    describe("Event populated state", () => {

        it("should not be able to open the edit drawer as an unauthenticated user", () => {
            cy.visit(createdEventUrl);
            cy.get(locators.event.OPEN_EDIT_DRAWER_BTN).should("not.exist");
        });

        it("should display updated metrics and claim cards after linking topics", () => {
            cy.login();
            cy.intercept("GET", "**/api/review*").as("getReviews");

            cy.visit(routes.listPage);
            cy.get(locators.event.EVENT_CARD).within(() => {
                cy.get(locators.event.METRICS_REVIEWS).should("contain", 0);
                cy.get(locators.event.METRICS_VERIFICATION_REQUESTS).should("contain", 1);
                cy.get(locators.event.METRICS_CLAIMS).should("contain", 2);

                cy.get(locators.event.SEE_FULL_EVENT).invoke("removeAttr", "target").click();
            });
            cy.url().should("contain", createdEventUrl);

            cy.wait("@getReviews");
            // Note: Testing populated reviews requires 2 seeded users to publish a report, which we don't have yet. Asserting as 0 for now.
            cy.get(locators.claimReview.REVIEW_CARD_CONTAINER).should("not.exist");
            cy.get(locators.event.EVENT_ITEMS_TOTAL_COUNT).should("contain", 0);

            cy.intercept("GET", "**/api/verification-request/**").as("getVerificationRequests");
            cy.get(locators.toggleButton.TOGGLE_BUTTON_RIGHT).click();
            cy.wait("@getVerificationRequests");

            cy.get(locators.verificationRequest.VERIFICATION_REQUEST_CARD_CONTAINER).should("be.visible");
            cy.get(locators.event.EVENT_ITEMS_TOTAL_COUNT).should("contain", 1);
        });
    });

    describe("Event editing via drawer", () => {
        beforeEach(() => {
            cy.login();
            cy.visit(createdEventUrl);
        });

        it("should open the edit drawer, change the main topic, and reset to empty state", () => {
            const newTopic = {
                name: "Conferência das Nações Unidas sobre as Mudanças Climáticas de 2023",
                aliases: ["COP28"],
                value: "Q123456"
            };

            const pastStart = getPastDay(33);
            const pastEnd = getPastDay(5);

            const expectedText = `Belém, Brasil v2 • ${formatMonthYear(pastStart.toDate())}`;

            cy.get(locators.event.OPEN_EDIT_DRAWER_BTN).click();

            fillEventForm(pastStart, pastEnd, {
                badge: `${newTopic.aliases[0]}`,
                name: `${newTopic.name} v2`,
                description: `${newTopic.name} description v2`,
                location: `Belém, Brasil v2`,
                mainTopic: newTopic
            });

            cy.intercept("PATCH", "**/api/event/**").as("updateEvent");

            saveEvent();

            cy.wait("@updateEvent");

            cy.get(locators.event.DETAIL_TITLE).should("be.visible").and("contain", `${newTopic.name} v2`);
            cy.get(locators.event.DETAIL_DESCRIPTION).should("be.visible").and("contain", `${newTopic.name} description v2`);
            cy.get(locators.event.DETAIL_LOCATION).should("have.text", expectedText);
            cy.get(locators.event.DETAIL_BADGE).should("be.visible").and("contain", `${newTopic.aliases[0]}`);

            cy.visit("/");
            cy.contains(`${newTopic.name} v2`).should("be.visible");

            cy.get(locators.event.EVENT_CARD).within(() => {
                cy.get(locators.event.METRICS_REVIEWS).should("contain", 0);
                cy.get(locators.event.METRICS_VERIFICATION_REQUESTS).should("contain", 0);
                cy.get(locators.event.METRICS_CLAIMS).should("contain", 0);
            });
        });
    });
});
