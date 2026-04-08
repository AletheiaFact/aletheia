import personality from "../fixtures/personality";

const locators = {
    login: {
        USER: "[data-cy=emailFormLogin]",
        PASSWORD: "[data-cy=passwordFormLogin]",
        BTN_LOGIN: "[data-cy=loginButton]",
    },

    signup: {
        NAME: "[data-cy=nameInputCreateAccount]",
        EMAIL: "[data-cy=emailInputCreateAccount]",
        PASSWORD: "[data-cy=passwordInputCreateAccount]",
        REPEATED_PASSWORD: "[data-cy=repeatedPasswordInputCreateAccount]",
        BTN_SUBMIT: "[data-cy=loginButton]",
        ERROR_NAME: "[data-cy=nameError]",
        ERROR_EMAIL: "[data-cy=emailError]",
        ERROR_PASSWORD: "[data-cy=passwordError]",
        ERROR_REPEATED_PASSWORD: "[data-cy=repeatedPasswordError]",
    },

    personality: {
        BTN_SEE_MORE_PERSONALITY: "[data-cy=testSeeMorePersonality]",
        BTN_ADD_PERSONALITY: "[data-cy=testButtonCreatePersonality]",
        INPUT_SEARCH_PERSONALITY: "[data-cy=testInputSearchPersonality]",
        SELECT_PERSONALITY: `[data-cy="${personality.name}"]`,
    },

    claim: {
        BTN_OK_TUTORIAL: "[data-cy=testButtonTutorialOk]",
        BTN_CLOSE_DRAWER: "[data-cy=testCloseReviewDrawer]",
        BTN_SEE_FULL_REVIEW: "[data-cy=testSeeFullReview]",
        BTN_ADD_SPEECH: "[data-cy=testSelectTypeSpeech]",
        BTN_ADD_IMAGE: "[data-cy=testSelectTypeImage]",
        BTN_SELECT_PERSONALITY: "[data-cy=testSelectPersonality]",
        BTN_NO_PERSONALITY: "[data-cy=testContinueWithoutPersonality]",
        BTN_UPLOAD_IMAGE: "[data-cy=testUploadImage]",
        BTN_SUBMIT_CLAIM: "[data-cy=testSaveButton]",
        INPUT_TITLE: "[data-cy=testTitleClaimForm]",
        INPUT_DATA: "[data-cy=testSelectDate]",
        INPUT_SOURCE: "[data-cy=testSource1]",
    },

    source: {
        INPUT_SOURCE: "[data-cy=testClaimReviewsource]",
        BTN_SUBMIT_SOURCE: "[data-cy=testSaveButton]",
    },

    floatButton: {
        FLOAT_BUTTON: "[data-cy=testFloatButton]",
        ADD_CLAIM: "[data-cy=testFloatButtonAddClaim]",
        ADD_PERSONALITY: "[data-cy=testFloatButtonAddPersonality]",
        ADD_SOURCE: "[data-cy=testFloatButtonAddSources]",
        ADD_VERIFICATION_REQUEST: "[data-cy=testFloatButtonAddVerificationRequest]",
        ADD_EVENT: "[data-cy=testFloatButtonAddEvent]"
    },

    toggleButton: {
        TOGGLE_BUTTON_LEFT: "[data-cy=testToggleButtonLeft]",
        TOGGLE_BUTTON_RIGHT: "[data-cy=testToggleButtonRight]",
    },

    topic: {
        ADD_TOPIC_ICON: "[data-cy=testAddTopicsToggle]",
        TYPE_TOPIC_INPUT: "[data-cy=testAddTopicsInput]",
        ADD_TOPIC_SUBMIT: "[data-cy=testAddTopicButton]",
        DETAIL_TOPIC_TAG: "[data-cy=testTopicChip0]",
        REMOVE_TOPIC_ICON: "[data-cy=testTopicRemoveButton0]",
    },

    claimReview: {
        BTN_START_CLAIM_REVIEW: "[data-cy=testAddFactCheckReviewButton]",
        INPUT_USER: "[data-cy=testClaimReviewusersId]",
        BTN_ASSIGN_USER: "[data-cy=testClaimReviewASSIGN_USER]",
        INPUT_SUMMARY: "[data-cy=testClaimReviewsummary]",
        INPUT_QUESTION: "[data-cy=testClaimReviewquestions0]",
        BTN_ADD_QUESTION: "[data-cy=testClaimReviewquestionsAdd]",
        BTN_REMOVE_QUESTION: "[data-cy=testClaimReviewquestionsRemove1]",
        INPUT_REPORT: "[data-cy=testClaimReviewreport]",
        INPUT_HOW: "[data-cy=testClaimReviewverification]",
        INPUT_SOURCE: "[data-cy=testClaimReviewsources0]",
        BTN_ADD_SOURCE: "[data-cy=testClaimReviewsourcesAdd]",
        BTN_REMOVE_SOURCE: "[data-cy=testClaimReviewsourcesRemove1]",
        BTN_FINISH_REPORT: "[data-cy=testClaimReviewFINISH_REPORT]",
        BTN_FULL_REVIEW: "[data-cy=testClaimReviewFULL_REVIEW]",
        INPUT_CLASSIFICATION: "[data-cy=testClassificationText]",
        INPUT_REVIEWER: "[data-cy=testClaimReviewreviewerId]",
        BTN_SAVE_DRAFT: "[data-cy=testClaimReviewSAVE_DRAFT]",
        BTN_SUBMIT: "[data-cy=testClaimReviewSEND_TO_REVIEW]",
        BTN_PUBLISH: "[data-cy=testClaimReviewPUBLISH]",
        BTN_SELECTED_REVIEW: "[data-cy=testClaimReviewSELECTED_REVIEW]",
        TEXT_REVIEWER_ERROR: "[data-cy=testReviewerError]",
        ADD_EDITOR_SOURCES: "[data-cy=testAddEditorSources]",
        ADD_EDITOR_SOURCES_DIALOG_INPUT:
            "[data-cy=testClaimReviewSourcesInput]",
        ADD_EDITOR_SOURCES_DIALOG_BUTTON:
            "[data-cy=testClaimReviewSourcesButton]",
        BTN_REVIEW_CLAIM_IMAGE: "[data-cy=testReviewClaimImage]",

        REVIEW_CARD_CONTAINER: "[data-cy=testReviewCardContainer]",
        BTN_RECAPTCHA_CONFIRM: "[data-cy=testRecaptchaConfirm]",
    },

    verificationRequest: {
        FORM_CONTENT: "[data-cy=testClaimReviewcontent]",
        FORM_REPORT_TYPE: "[data-cy=testClaimReviewreportType]",
        FORM_IMPACT_AREA: "[data-cy=testClaimReviewimpactArea]",
        FORM_HEARD_FROM: "[data-cy=testClaimReviewheardFrom]",
        FORM_SOURCE: "[data-cy=testClaimReviewsource]",
        FORM_EMAIL: "[data-cy=testClaimReviewemail]",

        FORM_SOURCE_ITEM_0: "[data-cy=testClaimReviewsourceEdit-0]",
        FORM_SOURCE_ITEM_1: "[data-cy=testClaimReviewsourceEdit-1]",
        FORM_SOURCE_ADD: "[data-cy=testClaimReviewsource-addSources]",
        FORM_SOURCE_REMOVE_2: "[data-cy=testClaimReviewsourceRemove-2]",

        DETAIL_CONTENT: "[data-cy=testVerificationRequestContent]",
        DETAIL_REPORT_TYPE: "[data-cy=testVerificationRequestReportType]",
        DETAIL_IMPACT_AREA: "[data-cy=testVerificationRequestImpactArea]",
        DETAIL_SOURCE_CHANNEL: "[data-cy=testVerificationRequestSourceChannel]",
        DETAIL_SEVERITY: "[data-cy=testVerificationRequestSeverity]",
        DETAIL_HEARD_FROM: "[data-cy=testVerificationRequestHeardFrom]",
        DETAIL_PUBLICATION_DATE:
            "[data-cy=testVerificationRequestPublicationDate]",
        DETAIL_DATE: "[data-cy=testVerificationRequestDate]",
        DETAIL_SOURCE_0: "[data-cy=testVerificationRequestSource0]",
        DETAIL_SOURCE_1: "[data-cy=testVerificationRequestSource1]",

        ERROR_VALIDATION_CONTENT: "[data-cy=testClaimReviewErrorcontent]",
        ERROR_VALIDATION_PUBLICATION_DATE:
            "[data-cy=testClaimReviewErrorpublicationDate]",

        DETAIL_CARD_CONTENT: "[data-cy=testVerificationRequestCardContent0]",
        DETAIL_CARD_CONTENT_1: "[data-cy=testVerificationRequestCardContent1]",

        SEE_FULL_BUTTON: "[data-cy=testSeeFullVerificationRequest]",
        EDIT_BUTTON: "[data-cy=testVerificationRequestEditButton]",
        SAVE_BUTTON: "[data-cy=testSaveButton]",
        CANCEL_BUTTON: "[data-cy=testCancelButton]",

        VERIFICATION_REQUEST_CARD_CONTAINER: "[data-cy=testVerificationRequestCardContainer]"
    },

    event: {
        FORM_BADGE: "[data-cy=testClaimReviewbadge]",
        FORM_NAME: "[data-cy=testClaimReviewname]",
        FORM_DESCRIPTION: "[data-cy=testClaimReviewdescription]",
        FORM_LOCATION: "[data-cy=testClaimReviewlocation]",
        FORM_START_DATE: "[data-cy=testClaimReviewstartDate]",
        FORM_END_DATE: "[data-cy=testClaimReviewendDate]",
        FORM_MAIN_TOPIC: "[data-cy=testClaimReviewmainTopic]",

        DETAIL_TITLE: "[data-cy=testEventTitle]",
        DETAIL_DESCRIPTION: "[data-cy=testEventDescription]",
        DETAIL_LOCATION: "[data-cy=testEventLocationText]",
        DETAIL_BADGE: "[data-cy=testEventBadgeChip]",
        EVENT_ITEMS_TOTAL_COUNT: "[data-cy=testTotalCountText]",
        OPEN_EDIT_DRAWER_BTN: "[data-cy=testEventEditButton]",

        SEE_MORE_EVENTS: "[data-cy=testSeeMoreEvents]",

        EVENT_CARD: "[data-cy=event-card]",
        METRICS_REVIEWS: "[data-cy=testEventMetricsReviews]",
        METRICS_VERIFICATION_REQUESTS: "[data-cy=testEventMetricsVerificationRequests]",
        METRICS_CLAIMS: "[data-cy=testEventMetricsClaims]",
        SEE_FULL_EVENT: "[data-cy=testOpenEventButton]",

        ERROR_VALIDATION_NAME: "[data-cy=testClaimReviewErrorname]",
        ERROR_VALIDATION_MAIN_TOPIC: "[data-cy=testClaimReviewErrormainTopic]",

        SAVE_BUTTON: "[data-cy=testSaveButton]",
    },

    header: {
        SOURCE_ITEM: "[data-cy=testSourceNavLink]",
        VERIFICATION_REQUEST_ITEM: "[data-cy=testVerificationRequestNavLink]",
        EVENT_ITEM: "[data-cy=testEventNavLink]",

        OPEN_REPOSITORY_MENU: "[data-cy=testRepositoryItem]",
        PERSONALITY_ITEM: "[data-cy=testpersonalityItem]",
        CLAIM_ITEM: "[data-cy=testclaimItem]",

        OPEN_INSTITUTION_MENU: "[data-cy=testInstitutionalItem]",
        ABOUT_ITEM: "[data-cy=testaboutItem]",
        PRIVACY_POLICY_ITEM: "[data-cy=testprivacyPolicyItem]",
        CODE_OF_CONDUCT_ITEM: "[data-cy=testcodeOfConductItem]",
        SUPPORTIVE_MATERIALS_ITEM: "[data-cy=testsupportiveMaterialsItem]",

        OPEN_USER_MENU: "[data-cy=testMyAccountItem]",

        PROFILE_ITEM: "[data-cy=testProfileItem]",
        LOGIN_ITEM: "[data-cy=testLoginItem]",

        LOGOUT_ITEM: "[data-cy=testLogoutItem]",
        REGISTER_ITEM: "[data-cy=testRegisterItem]",

        KANBAN_ITEM: "[data-cy=testKanbanItem]",
        ADMIN_ITEM: "[data-cy=testadminItem]",
        BADGES_ITEM: "[data-cy=testbadgesItem]",
        NAMESPACE_ITEM: "[data-cy=testnamespaceItem]",
    },

    footer: {
        CTA_PRIMARY: "[data-cy=testFooterCtaPrimaryLink]",
        CTA_SECONDARY: "[data-cy=testFooterCtaSecondaryLink]",

        SOCIAL_INSTAGRAM: "[data-cy=testFooterSocialInstagram]",
        SOCIAL_FACEBOOK: "[data-cy=testFooterSocialFacebook]",
        SOCIAL_LINKEDIN: "[data-cy=testFooterSocialLinkedIn]",
        SOCIAL_GITHUB: "[data-cy=testFooterSocialGithub]",

        PLATFORM_ACCESS: "[data-cy=testFooterLinkPlatformAccess]",
        PLATFORM_MANUAL: "[data-cy=testFooterLinkPlatformManual]",
        PLATFORM_DOCS: "[data-cy=testFooterLinkPlatformDocs]",

        INSTITUTIONAL_ABOUT: "[data-cy=testFooterLinkInstitutionalAbout]",
        INSTITUTIONAL_PARTNERS: "[data-cy=testFooterLinkInstitutionalPartners]",
        INSTITUTIONAL_AWARDS: "[data-cy=testFooterLinkInstitutionalAwards]",

        COMMUNITY_COLLABORATION: "[data-cy=testFooterLinkCommunityCollaboration]",
        COMMUNITY_UNIVERSITIES: "[data-cy=testFooterLinkCommunityUniversities]",
        COMMUNITY_VOLUNTEERING: "[data-cy=testFooterLinkCommunityVolunteering]",

        STATUTE: "[data-cy=testFooterStatuteLink]",
        CREATIVE_COMMONS: "[data-cy=testFooterCreativeCommonsLink]",
    }
};
export default locators;
