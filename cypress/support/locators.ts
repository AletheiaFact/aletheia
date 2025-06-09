import personality from "../fixtures/personality";

const locators = {
    login: {
        USER: "[data-cy=emailFormLogin]",
        PASSWORD: "[data-cy=passwordFormLogin]",
        BTN_LOGIN: "[data-cy=loginButton]",
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
        INPUT_DATA_TODAY: ".MuiPickersDay-today",
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
    },

    menu: {
        SIDE_MENU: "[data-cy=testOpenSideMenu]",
        USER_ICON: "[data-cy=testUserIcon]",
        LOGIN_MENU: "[data-cy=testLoginItem]",
        MY_ACCOUNT_MENU: "[data-cy=testMyAccountItem]",
        LOGOUT_MENU: "[data-cy=testLogout]",
    },
};
export default locators;
