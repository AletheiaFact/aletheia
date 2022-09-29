import personality from "../fixtures/personality";

const locators = {
    login: {
        USER: "#basic_email",
        PASSWORD: "#basic_password",
        BTN_LOGIN: "[data-cy=loginButton]",
    },

    personality: {
        BTN_SEE_MORE_PERSONALITY: "[data-cy=testSeeMorePersonality]",
        BTN_ADD_PERSONALITY: "[data-cy=testButtonCreatePersonality]",
        INPUT_SEARCH_PERSONALITY: "[data-cy=testInputSearchPersonality]",
        SELECT_PERSONALITY: `[data-cy=${personality.name}]`,
    },

    claim: {
        BTN_OK_TUTORIAL: "[data-cy=testButtonTutorialOk]",
    },

    floatButton: {
        FLOAT_BUTTON: "[data-cy=testFloatButton]",
        ADD_CLAIM: "[data-cy=testFloatButtonAddClaim]",
        ADD_PERSONALITY: "[data-cy=testFloatButtonAddPersonality]",
    },

    claimReview: {
        BTN_START_CLAIM_REVIEW: "[data-cy=testAddReviewButton]",
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
        INPUT_CLASSIFICATION: "[data-cy=testClassificationText]",
        INPUT_REVIEWER: "[data-cy=testClaimReviewreviewerId]",
        BTN_SAVE_DRAFT: "[data-cy=testClaimReviewSAVE_DRAFT]",
        BTN_SUBMIT: "[data-cy=testClaimReviewSUBMIT]",
        BTN_PUBLISH: "[data-cy=testClaimReviewPUBLISH]",
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
