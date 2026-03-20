/// <reference types="cypress" />

import claim from "../../fixtures/claim";
import { minimumContent } from "../../fixtures/verificationRequest";
import locators from "../../support/locators";
import { getFutureDay, today } from "../../utils/dateUtils";

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

    const buildEvent = (overrides = {}) => {
        return {
            badge: "COP30",
            name: topic.name,
            description: "E2E test event description",
            location: "Belém, Brasil",
            startDate: today.toISOString(),
            endDate: getFutureDay(2).toISOString(),
            mainTopic: { name: topic.name, wikidataId: topic.value },
            filterTopics: [],
            ...overrides,
        };
    };

    beforeEach(() => {
        cy.login();
        cy.intercept("POST", "**/api/topics/**").as("postTopic");
    });

    const openCreateEventForm = () => {
        cy.get(locators.floatButton.FLOAT_BUTTON).click();
        cy.get(locators.floatButton.ADD_EVENT).click();
        cy.url().should("contain", routes.createPage);
    };

    const fillEventForm = (startDate, endDate) => {
        const event = buildEvent();
        cy.get(locators.event.FORM_BADGE).type(event.badge);
        cy.get(locators.event.FORM_NAME).type(event.name);
        cy.get(locators.event.FORM_DESCRIPTION).type(event.description);
        cy.get(locators.event.FORM_LOCATION).type(event.location);

        cy.selectDatePickerDate(0, startDate);
        cy.wait(500);
        cy.selectDatePickerDate(1, endDate);

        cy.get(locators.event.FORM_MAIN_TOPIC).type(topic.aliases[0], { delay: 200 });
        cy.contains(topic.name).should("be.visible").click();
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
        it("should prevent submission when required fields are missing", () => {
            openCreateEventForm();
            saveEvent();

            cy.get(locators.event.ERROR_VALIDATION_NAME).should("be.visible");
            cy.get(locators.event.ERROR_VALIDATION_MAIN_TOPIC).should("be.visible");
            cy.url().should("contain", routes.createPage);
        });

        it("should create an event successfully (happy path)", () => {
            cy.intercept("POST", "**/api/event/").as("createEvent");

            openCreateEventForm();
            fillEventForm(today, getFutureDay(2));
            saveEvent();

            cy.wait("@createEvent").then((interception) => {
                expect(interception.response.statusCode).to.be.oneOf([200, 201]);
                const { data_hash, slug } = interception.response.body;
                cy.url().should("contain", `/event/${data_hash}/${slug}`);
                cy.get(locators.event.DETAIL_TITLE).should("be.visible");
            });
        });
    });

    describe("Topic integration tests in claims to be linked", () => {
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
});
