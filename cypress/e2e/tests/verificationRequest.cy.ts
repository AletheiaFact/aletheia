
/// <reference types="cypress" />

import { fullVerificationRequest, regexVerificationRequestPage, updatedSource, minimumVerificationRequest } from "../../fixtures/verificationRequest";
import locators from "../../support/locators";
import dayjs, { Dayjs } from "dayjs"

describe("Test verification request", () => {
    const today = dayjs();
    const getPastDay = (daysAgo: number) => {
        return dayjs().subtract(daysAgo, "day");
    };

    const openCreateVerificationRequestForm = () => {
        cy.get(locators.floatButton.FLOAT_BUTTON).click();
        cy.get(locators.floatButton.ADD_VERIFICATION_REQUEST).click();
        cy.url().should("contain", "/verification-request/create");
    };

    const selectPublicationDate = (date: Dayjs) => {
        cy.get(locators.verificationRequest.FORM_PUBLICATION_DATE).click();
        cy.contains('[role="gridcell"]', date.format("D")).click();
    };

    const saveVerificationRequest = () => {
        cy.checkRecaptcha();
        cy.get(locators.verificationRequest.SAVE_BUTTON).click();
    };

    const assertDetailFields = (fields: Array<[string, string]>) => {
        fields.forEach(([selector, expected]) => {
            cy.get(selector).should("be.visible").and("contain", expected);
        });
    };

    const goToVerificationRequest = (data_hash: string) => {
        cy.intercept("GET", "**/verification-request/**").as("getVerification");
        cy.visit(`http://localhost:3000/verification-request/${data_hash}`);
        cy.wait("@getVerification");
    }

    describe("lifecycle verification request", () => {
        beforeEach("login", () => cy.login());

        it("should create a verification request with all optional and mandatory fields", () => {
            openCreateVerificationRequestForm();

            cy.get(locators.verificationRequest.FORM_CONTENT).type(fullVerificationRequest.content);
            selectPublicationDate(today);
            cy.get(locators.verificationRequest.FORM_REPORT_TYPE).click();
            cy.contains(fullVerificationRequest.reportType).click();
            cy.get(locators.verificationRequest.FORM_IMPACT_AREA).type(fullVerificationRequest.impactArea, { delay: 200 });
            cy.contains(fullVerificationRequest.impactArea).click();

            cy.get(locators.verificationRequest.FORM_HEARD_FROM).type(fullVerificationRequest.heardFrom);
            cy.get(locators.verificationRequest.FORM_SOURCE).type(`https://${fullVerificationRequest.source}`);
            cy.get(locators.verificationRequest.FORM_EMAIL).type(fullVerificationRequest.email);
            cy.intercept("GET", "**/verification-request/**").as("getVerification");
            saveVerificationRequest();
            cy.wait("@getVerification");
            cy.url().should("match", regexVerificationRequestPage);

            assertDetailFields([
                [locators.verificationRequest.DETAIL_CONTENT, fullVerificationRequest.content],
                [locators.verificationRequest.DETAIL_REPORT_TYPE, fullVerificationRequest.reportType],
                [locators.verificationRequest.DETAIL_IMPACT_AREA, fullVerificationRequest.impactArea],
                [locators.verificationRequest.DETAIL_SOURCE_CHANNEL, "Web"],
                [locators.verificationRequest.DETAIL_HEARD_FROM, fullVerificationRequest.heardFrom],
                [locators.verificationRequest.DETAIL_PUBLICATION_DATE, today.format("DD/MM/YYYY")],
                [locators.verificationRequest.DETAIL_DATE, today.format("DD/MM/YYYY")],
                [locators.verificationRequest.DETAIL_SOURCE_0, fullVerificationRequest.source],
            ]);
        });

        it("should update an existing request by adding additional sources and modifying the publication date", () => {
            goToVerificationRequest(fullVerificationRequest.data_hash)

            cy.get(locators.verificationRequest.EDIT_BUTTON).should("be.visible").click();
            cy.get(locators.verificationRequest.FORM_SOURCE_ADD).click();
            cy.get(locators.verificationRequest.FORM_SOURCE_ITEM_1).type(`https://${updatedSource}`);
            selectPublicationDate(getPastDay(1));
            saveVerificationRequest();
            cy.url().should("match", regexVerificationRequestPage);

            assertDetailFields([
                [locators.verificationRequest.DETAIL_PUBLICATION_DATE, getPastDay(1).format("DD/MM/YYYY")],
                [locators.verificationRequest.DETAIL_SOURCE_1, updatedSource],
            ])
        })

        it("should prevent submission when required fields are missing", () => {
            openCreateVerificationRequestForm();
            saveVerificationRequest();
            cy.get(locators.verificationRequest.ERROR_VALIDATION_CONTENT).should("be.visible")
            cy.get(locators.verificationRequest.ERROR_VALIDATION_PUBLICATION_DATE).should("be.visible")
            cy.url().should("contain", "/verification-request/create");
        });

        it("should allow request creation using only the minimum mandatory information", () => {
            openCreateVerificationRequestForm();

            cy.get(locators.verificationRequest.FORM_CONTENT).type(minimumVerificationRequest.content);
            selectPublicationDate(today);
            cy.intercept("GET", "**/verification-request/**").as("getVerification");
            saveVerificationRequest();
            cy.wait("@getVerification");
            cy.url().should("match", regexVerificationRequestPage);

            assertDetailFields([
                [locators.verificationRequest.DETAIL_CONTENT, minimumVerificationRequest.content],
                [locators.verificationRequest.DETAIL_PUBLICATION_DATE, today.format("DD/MM/YYYY")],
            ])
        });

        it("should discard unsaved changes when the edition form is canceled", () => {
            goToVerificationRequest(minimumVerificationRequest.data_hash)

            cy.get(locators.verificationRequest.EDIT_BUTTON).should("be.visible").click();
            cy.get(locators.verificationRequest.FORM_SOURCE_ITEM_0).type(`https://${fullVerificationRequest.source}`);
            selectPublicationDate(getPastDay(10));
            cy.get(locators.verificationRequest.CANCEL_BUTTON).click();

            cy.get(locators.verificationRequest.DETAIL_PUBLICATION_DATE).should("be.visible").and("not.contain", getPastDay(10).format("DD/MM/YYYY"));
            cy.get(locators.verificationRequest.DETAIL_SOURCE_0).should("not.exist");
        })

        it("should supplement a minimalist request by adding its first source during edition", () => {
            goToVerificationRequest(minimumVerificationRequest.data_hash)

            cy.get(locators.verificationRequest.EDIT_BUTTON).should("be.visible").click();
            cy.get(locators.verificationRequest.FORM_SOURCE_ITEM_0).type(`https://${fullVerificationRequest.source}`);
            selectPublicationDate(getPastDay(1));
            saveVerificationRequest();
            cy.url().should("match", regexVerificationRequestPage);

            assertDetailFields([
                [locators.verificationRequest.DETAIL_PUBLICATION_DATE, getPastDay(1).format("DD/MM/YYYY")],
                [locators.verificationRequest.DETAIL_SOURCE_0, fullVerificationRequest.source],
            ])
        })

        it("should manage topic tags by adding and removing them", () => {
            goToVerificationRequest(minimumVerificationRequest.data_hash)

            cy.get(locators.verificationRequest.ADD_TOPIC_ICON).click();
            cy.get(locators.verificationRequest.TYPE_TOPIC_INPUT).type(fullVerificationRequest.impactArea.toLowerCase(), { delay: 200 });
            cy.contains(fullVerificationRequest.impactArea).click();
            cy.get(locators.verificationRequest.ADD_TOPIC_SUBMIT).click();

            cy.contains(locators.verificationRequest.DETAIL_TOPIC_TAG, fullVerificationRequest.impactArea.toUpperCase())
                .should("be.visible")
                .within(() => {
                    cy.get(locators.verificationRequest.REMOVE_TOPIC_ICON).click();
                });

            cy.contains(locators.verificationRequest.DETAIL_TOPIC_TAG, fullVerificationRequest.impactArea.toUpperCase()).should("not.exist");
        })
    });
});
