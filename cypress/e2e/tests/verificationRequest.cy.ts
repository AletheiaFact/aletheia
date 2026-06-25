/// <reference types="cypress" />

import {
    fullVerificationRequest,
    regexVerificationRequestPage,
    updatedSource,
    minimumContent,
} from "../../fixtures/verificationRequest";
import locators from "../../support/locators";
import { getPastDay, today } from "../../utils/dateUtils";

describe("Test verification request", () => {
    const getHashFromUrl = (interception: any) =>
        interception.request.url.split("/").pop();

    const openCreateVerificationRequestForm = () => {
        cy.get(locators.floatButton.FLOAT_BUTTON).click();
        cy.get(locators.floatButton.ADD_VERIFICATION_REQUEST).click();
        cy.url().should("contain", "/verification-request/create");
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
        cy.visit(`/verification-request/${data_hash}`);
        cy.wait("@getVerification");
    };

    describe("lifecycle verification request", () => {
        beforeEach("login", () => cy.login());

        it("should prevent submission when required fields are missing", () => {
            openCreateVerificationRequestForm();
            saveVerificationRequest();
            cy.get(
                locators.verificationRequest.ERROR_VALIDATION_CONTENT
            ).should("be.visible");
            cy.get(
                locators.verificationRequest.ERROR_VALIDATION_PUBLICATION_DATE
            ).should("be.visible");
            cy.url().should("contain", "/verification-request/create");
        });

        describe("Full verification request flow", () => {
            let fullRequestHash: string;

            it("should create a verification request with all optional and mandatory fields", () => {
                openCreateVerificationRequestForm();
                cy.intercept("GET", "**/verification-request/**").as(
                    "getVerification"
                );

                cy.get(locators.verificationRequest.FORM_CONTENT).type(
                    fullVerificationRequest.content
                );
                cy.selectDatePickerDate(0, today);
                cy.get(locators.verificationRequest.FORM_REPORT_TYPE).click();
                cy.contains(fullVerificationRequest.reportType).click();
                cy.get(locators.verificationRequest.FORM_IMPACT_AREA).type(
                    fullVerificationRequest.impactArea,
                    { delay: 200 }
                );
                cy.contains(fullVerificationRequest.impactArea).click();

                cy.get(locators.verificationRequest.FORM_HEARD_FROM).type(
                    fullVerificationRequest.heardFrom
                );
                cy.get(locators.verificationRequest.FORM_SOURCE).type(
                    `https://${fullVerificationRequest.source}`
                );
                cy.get(locators.verificationRequest.FORM_EMAIL).type(
                    fullVerificationRequest.email
                );
                saveVerificationRequest();

                cy.wait("@getVerification").then((interception) => {
                    getHashFromUrl(interception);
                    fullRequestHash = getHashFromUrl(interception);
                    cy.log("Hash capturado:", fullRequestHash);
                });
                cy.url().should("match", regexVerificationRequestPage);

                assertDetailFields([
                    [
                        locators.verificationRequest.DETAIL_CONTENT,
                        fullVerificationRequest.content,
                    ],
                    [
                        locators.verificationRequest.DETAIL_REPORT_TYPE,
                        fullVerificationRequest.reportType,
                    ],
                    [
                        locators.verificationRequest.DETAIL_IMPACT_AREA,
                        fullVerificationRequest.impactArea,
                    ],
                    [locators.verificationRequest.DETAIL_SOURCE_CHANNEL, "Web"],
                    [
                        locators.verificationRequest.DETAIL_HEARD_FROM,
                        fullVerificationRequest.heardFrom,
                    ],
                    [
                        locators.verificationRequest.DETAIL_PUBLICATION_DATE,
                        today.format("DD/MM/YYYY"),
                    ],
                    [
                        locators.verificationRequest.DETAIL_DATE,
                        today.format("DD/MM/YYYY"),
                    ],
                    [
                        locators.verificationRequest.DETAIL_SOURCE_0,
                        fullVerificationRequest.source,
                    ],
                ]);

                it("should update an existing request by adding additional sources and modifying the publication date", () => {
                    goToVerificationRequest(fullRequestHash);

                    cy.get(locators.verificationRequest.EDIT_BUTTON)
                        .should("be.visible")
                        .click();
                    cy.get(
                        locators.verificationRequest.FORM_SOURCE_ADD
                    ).click();
                    cy.get(
                        locators.verificationRequest.FORM_SOURCE_ITEM_1
                    ).type(`https://${updatedSource}`);
                    cy.selectDatePickerDate(0, getPastDay(1));
                    saveVerificationRequest();
                    cy.url().should("match", regexVerificationRequestPage);

                    assertDetailFields([
                        [
                            locators.verificationRequest
                                .DETAIL_PUBLICATION_DATE,
                            getPastDay(1).format("DD/MM/YYYY"),
                        ],
                        [
                            locators.verificationRequest.DETAIL_SOURCE_1,
                            updatedSource,
                        ],
                    ]);
                });
            });

            it("should manage topic tags by adding and removing them", () => {
                goToVerificationRequest(fullRequestHash);
                cy.intercept("PUT", "**/verification-request/*/topics").as(
                    "updateTopics"
                );

                cy.get(locators.topic.ADD_TOPIC_ICON).click();
                cy.get(locators.topic.TYPE_TOPIC_INPUT).type(
                    fullVerificationRequest.topic,
                    { delay: 200 }
                );
                cy.contains(fullVerificationRequest.topic).click();
                cy.get(locators.topic.ADD_TOPIC_SUBMIT).click();

                cy.wait("@updateTopics").then((interception) => {
                    expect(interception.response?.statusCode).to.be.oneOf([
                        200, 201,
                    ]);
                });

                cy.contains(
                    locators.topic.DETAIL_TOPIC_TAG,
                    fullVerificationRequest.topic.toUpperCase()
                )
                    .should("be.visible")
                    .within(() => {
                        cy.get(locators.topic.REMOVE_TOPIC_ICON).click();
                    });

                cy.contains(
                    locators.topic.DETAIL_TOPIC_TAG,
                    fullVerificationRequest.topic.toUpperCase()
                ).should("not.exist");
            });

            it("should discard unsaved changes when the edition form is canceled", () => {
                goToVerificationRequest(fullRequestHash);

                cy.get(locators.verificationRequest.EDIT_BUTTON)
                    .should("be.visible")
                    .click();
                cy.get(locators.verificationRequest.FORM_SOURCE_ADD).click();
                cy.get(locators.verificationRequest.FORM_SOURCE_ITEM_1).type(
                    `https://${updatedSource}`
                );
                cy.selectDatePickerDate(0, getPastDay(10));
                cy.get(locators.verificationRequest.CANCEL_BUTTON).click();

                cy.get(locators.verificationRequest.DETAIL_PUBLICATION_DATE)
                    .should("be.visible")
                    .and("not.contain", getPastDay(10).format("DD/MM/YYYY"));
                cy.get(locators.verificationRequest.DETAIL_SOURCE_1).should(
                    "not.exist"
                );
            });
        });

        describe("Minimum verification request flow", () => {
            let minRequestHash: string;

            it("should allow request creation using only the minimum mandatory information", () => {
                openCreateVerificationRequestForm();
                cy.intercept("GET", "**/verification-request/**").as(
                    "getVerification"
                );

                cy.get(locators.verificationRequest.FORM_CONTENT).type(
                    minimumContent
                );
                cy.selectDatePickerDate(0, today);
                saveVerificationRequest();
                cy.wait("@getVerification").then((interception) => {
                    getHashFromUrl(interception);
                    minRequestHash = getHashFromUrl(interception);

                    cy.log("Hash capturado:", minRequestHash);
                });
                cy.url().should("match", regexVerificationRequestPage);

                assertDetailFields([
                    [
                        locators.verificationRequest.DETAIL_CONTENT,
                        minimumContent,
                    ],
                    [
                        locators.verificationRequest.DETAIL_PUBLICATION_DATE,
                        today.format("DD/MM/YYYY"),
                    ],
                ]);
            });

            it("should supplement a minimalist request by adding its first source during edition", () => {
                goToVerificationRequest(minRequestHash);

                cy.get(locators.verificationRequest.EDIT_BUTTON)
                    .should("be.visible")
                    .click();
                cy.get(locators.verificationRequest.FORM_SOURCE_ITEM_0).type(
                    `https://${fullVerificationRequest.source}`
                );
                cy.selectDatePickerDate(0, getPastDay(1));
                saveVerificationRequest();
                cy.url().should("match", regexVerificationRequestPage);

                assertDetailFields([
                    [
                        locators.verificationRequest.DETAIL_PUBLICATION_DATE,
                        getPastDay(1).format("DD/MM/YYYY"),
                    ],
                    [
                        locators.verificationRequest.DETAIL_SOURCE_0,
                        fullVerificationRequest.source,
                    ],
                ]);
            });
        });
    });
});
