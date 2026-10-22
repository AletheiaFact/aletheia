/// <reference types="cypress" />

import claim from "../../fixtures/claim";
import { minimumContent } from "../../fixtures/verificationRequest";
import locators from "../../support/locators";
import { getFutureDay, getPastDay, today } from "../../utils/dateUtils";
import { formatMonthYear } from "../../../src/helpers/formatTimeAgo";
import {
    buildEvent,
    routes,
    topic,
    cop28Topic,
    participantOrganizations,
} from "../../fixtures/event";
import { Dayjs } from "dayjs";

let createdEventUrl = "";

const openCreateEventForm = () => {
    cy.get(locators.floatButton.FLOAT_BUTTON).click();
    cy.get(locators.floatButton.ADD_EVENT).click();
    cy.url().should("contain", routes.createPage);
};

const fillEventForm = (startDate: Dayjs, endDate: Dayjs, overrides = {}) => {
    const event = buildEvent(overrides);

    cy.get(locators.event.FORM_BADGE).type(
        `{selectall}{backspace}${event.badge}`
    );
    cy.get(locators.event.FORM_NAME).type(
        `{selectall}{backspace}${event.name}`
    );
    cy.get(locators.event.FORM_DESCRIPTION).type(
        `{selectall}{backspace}${event.description}`
    );
    cy.get(locators.event.FORM_LOCATION).type(
        `{selectall}{backspace}${event.location}`
    );

    cy.selectDatePickerDate(0, startDate);
    cy.get(".MuiPickersPopper-root").should("not.exist");
    cy.selectDatePickerDate(1, endDate);

    cy.intercept("GET", "**/api/topics/?topicName=*").as("searchTopics");
    cy.get(locators.event.FORM_MAIN_TOPIC).type(
        `{selectall}{backspace}${event.mainTopic.aliases[0]}`,
        { delay: 200 }
    );
    cy.wait("@searchTopics");
    cy.contains(event.mainTopic.name).should("be.visible").click();
};

const addNewParticipant = (
    index: number,
    organization: typeof participantOrganizations[number]
) => {
    cy.get(locators.event.PARTICIPANTS_ADD_NEW).click();
    cy.get(locators.event.participantName(index)).type(organization.name);
    if (organization.website) {
        cy.get(locators.event.participantWebsite(index)).type(
            organization.website
        );
    }
    cy.get(locators.event.participantLogoInput(index)).selectFile(
        organization.logo,
        { force: true }
    );
    cy.get(locators.event.participantDone(index)).click();
};

const assertParticipantLogos = (names: string[]) => {
    cy.get(locators.event.DETAIL_PARTICIPANTS).should("be.visible");
    cy.get(`${locators.event.DETAIL_PARTICIPANT} img`).should(
        "have.length",
        names.length
    );
    names.forEach((name, index) => {
        cy.get(`${locators.event.DETAIL_PARTICIPANT} img`)
            .eq(index)
            .should("have.attr", "alt", name);
    });
};

const saveEvent = () => {
    cy.checkRecaptcha();
    cy.get(locators.event.SAVE_BUTTON).click();
};

const fillAndSaveEvent = (startDate: Dayjs, endDate: Dayjs, overrides = {}) => {
    fillEventForm(startDate, endDate, overrides);
    saveEvent();
};

const addTopicFlow = (aliasType: string, labelToClick: string) => {
    cy.get(locators.topic.ADD_TOPIC_ICON).click();
    cy.get(locators.topic.TYPE_TOPIC_INPUT).should("be.visible").click();
    cy.get(locators.topic.TYPE_TOPIC_INPUT).find("input").should("have.focus");

    cy.get(locators.topic.TYPE_TOPIC_INPUT)
        .clear()
        .type(aliasType, { delay: 200 });
    cy.contains(labelToClick).should("be.visible").click();

    cy.get(locators.topic.ADD_TOPIC_SUBMIT).click();

    cy.wait("@postTopic").then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
    });
};

const assertEventCardMetrics = (
    reviews: number,
    verificationRequests: number,
    claims: number
) => {
    cy.get(locators.event.EVENT_CARD).within(() => {
        cy.get(locators.event.METRICS_REVIEWS).should("contain", reviews);
        cy.get(locators.event.METRICS_VERIFICATION_REQUESTS).should(
            "contain",
            verificationRequests
        );
        cy.get(locators.event.METRICS_CLAIMS).should("contain", claims);
    });
};

describe("Test events infrastructure", () => {
    describe("event creation", () => {
        beforeEach(() => {
            cy.login();
            cy.intercept("POST", "**/api/topics/**").as("postTopic");
        });

        it("should prevent submission when required fields are missing", () => {
            openCreateEventForm();
            saveEvent();

            cy.get(locators.event.ERROR_VALIDATION_NAME).should("be.visible");
            cy.get(locators.event.ERROR_VALIDATION_MAIN_TOPIC).should(
                "be.visible"
            );
            cy.url().should("contain", routes.createPage);
        });

        it("should show validation error when endDate is before startDate", () => {
            openCreateEventForm();
            fillAndSaveEvent(getFutureDay(10), getFutureDay(5));

            cy.contains(
                "A data de término não pode ser anterior à data de início"
            ).should("be.visible");
            cy.url().should("contain", routes.createPage);
        });

        it("should create an event successfully (happy path)", () => {
            cy.intercept("POST", "**/api/event/").as("createEvent");
            const event = buildEvent();

            openCreateEventForm();
            fillAndSaveEvent(today, getFutureDay(2));

            cy.wait("@createEvent").then((interception) => {
                expect(interception.response?.statusCode).to.be.oneOf([
                    200, 201,
                ]);
                const { data_hash, slug } = interception.response?.body;

                createdEventUrl = `/event/${data_hash}/${slug}`;
                cy.url().should("contain", createdEventUrl);
                cy.get(locators.event.DETAIL_TITLE)
                    .should("be.visible")
                    .and("contain", event.name);
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

            cy.get(".remirror-editor").should("exist");
            cy.get("[data-testid='report - loading - spinner']").should(
                "not.exist"
            );

            addTopicFlow(topic.aliases[0], topic.name);
        });

        it("should add topics to a verification request", () => {
            cy.get(locators.header.VERIFICATION_REQUEST_ITEM).click();
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
        it("should display updated metrics and claim cards after linking topics", () => {
            cy.intercept("GET", "**/api/verification-request/**").as(
                "getVerificationRequests"
            );

            cy.login();
            cy.visit(routes.listPage);

            assertEventCardMetrics(0, 1, 2);

            cy.get(locators.event.EVENT_CARD).within(() => {
                cy.get(locators.event.SEE_FULL_EVENT)
                    .invoke("removeAttr", "target")
                    .click();
            });

            cy.url().should("contain", createdEventUrl);

            cy.get(locators.toggleButton.TOGGLE_BUTTON_RIGHT).click();
            cy.wait("@getVerificationRequests");

            cy.get(
                locators.verificationRequest.VERIFICATION_REQUEST_CARD_CONTAINER
            ).should("be.visible");
            cy.get(locators.event.EVENT_ITEMS_TOTAL_COUNT).should("contain", 1);

            cy.get(locators.toggleButton.TOGGLE_BUTTON_LEFT).click();
            // Note: Testing populated reviews requires 2 seeded users to publish a
            // report, which we don't have yet. Asserting as 0 for now.
            cy.get(locators.claimReview.REVIEW_CARD_CONTAINER).should(
                "not.exist"
            );
            cy.get(locators.event.EVENT_ITEMS_TOTAL_COUNT).should("contain", 0);
        });
    });

    describe("Event editing via drawer", () => {
        it("should not be able to open the edit drawer as an unauthenticated user", () => {
            cy.visit(createdEventUrl);
            cy.get(locators.event.OPEN_EDIT_DRAWER_BTN).should("not.exist");
        });

        it("should open the edit drawer, change the main topic, and reset to empty state", () => {
            const pastStart = getPastDay(33);
            const pastEnd = getPastDay(5);

            const updatedOverrides = {
                badge: cop28Topic.aliases[0],
                name: `${cop28Topic.name} v2`,
                description: `${cop28Topic.name} description v2`,
                location: "Belém, Brasil v2",
                mainTopic: cop28Topic,
            };

            cy.login();
            cy.visit(createdEventUrl);

            cy.get(locators.event.OPEN_EDIT_DRAWER_BTN).click();

            fillAndSaveEvent(pastStart, pastEnd, updatedOverrides);

            cy.get(locators.event.DETAIL_TITLE)
                .should("be.visible")
                .and("contain", updatedOverrides.name);
            cy.get(locators.event.DETAIL_DESCRIPTION)
                .should("be.visible")
                .and("contain", updatedOverrides.description);
            cy.get(locators.event.DETAIL_LOCATION).should(
                "have.text",
                `${updatedOverrides.location} • ${formatMonthYear(
                    pastStart.toDate()
                )}`
            );
            cy.get(locators.event.DETAIL_BADGE)
                .should("be.visible")
                .and("contain", updatedOverrides.badge);

            cy.visit("/");
            cy.contains(updatedOverrides.name).should("be.visible");
            assertEventCardMetrics(0, 0, 0);
        });
    });

    describe("Event participants", () => {
        const [first, second] = participantOrganizations;

        beforeEach(() => {
            cy.login();
            cy.intercept("PATCH", "**/api/event/*").as("updateEvent");
        });

        it("should not show the participants row while the event has none", () => {
            cy.visit(createdEventUrl);
            cy.get(locators.event.DETAIL_TITLE).should("be.visible");
            cy.get(locators.event.DETAIL_PARTICIPANTS).should("not.exist");
        });

        it("should block saving a new organization without a logo", () => {
            cy.visit(createdEventUrl);
            cy.get(locators.event.OPEN_EDIT_DRAWER_BTN).click();

            cy.get(locators.event.PARTICIPANTS_ADD_NEW).click();
            cy.get(locators.event.participantName(0)).type(first.name);
            saveEvent();

            cy.get(locators.event.ERROR_VALIDATION_PARTICIPANTS).should(
                "be.visible"
            );
        });

        it("should create organizations in the drawer and show their logos in order", () => {
            cy.visit(createdEventUrl);
            cy.get(locators.event.OPEN_EDIT_DRAWER_BTN).click();

            addNewParticipant(0, first);
            addNewParticipant(1, second);
            saveEvent();

            cy.wait("@updateEvent")
                .its("response.statusCode")
                .should("eq", 200);
            assertParticipantLogos([first.name, second.name]);
            cy.get(locators.event.DETAIL_PARTICIPANT)
                .first()
                .should("have.attr", "href", first.website)
                .and("have.attr", "rel", "noopener noreferrer");
        });

        it("should reorder and remove participants", () => {
            cy.visit(createdEventUrl);
            cy.get(locators.event.OPEN_EDIT_DRAWER_BTN).click();

            cy.get(locators.event.participantUp(1)).click();
            saveEvent();
            cy.wait("@updateEvent");
            assertParticipantLogos([second.name, first.name]);

            cy.get(locators.event.OPEN_EDIT_DRAWER_BTN).click();
            cy.get(locators.event.participantRemove(0)).click();
            saveEvent();
            cy.wait("@updateEvent");
            assertParticipantLogos([first.name]);
        });

        it("should find an existing organization through the search", () => {
            cy.intercept("GET", "**/api/organization/?name=*").as(
                "searchOrganizations"
            );
            cy.visit(createdEventUrl);
            cy.get(locators.event.OPEN_EDIT_DRAWER_BTN).click();

            cy.get(locators.event.PARTICIPANTS_SEARCH).type("Dois", {
                delay: 100,
            });
            cy.wait("@searchOrganizations");
            cy.contains("li", second.name).click();
            saveEvent();

            cy.wait("@updateEvent");
            assertParticipantLogos([first.name, second.name]);
        });
    });
});
