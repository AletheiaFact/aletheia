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
        SELECT_PERSONALITY: `[data-cy=${personality.name}]`
    },

    claimReview: {
        BTN_START_CLAIM_REVIEW: "[data-cy=testAddReviewButton]",
        INPUT_USER: "[data-cy=testClaimReviewuserId]",
        BTN_ASSIGN_USER: "[data-cy=testClaimReviewASSIGN_USER]",
    },

    menu: {
        SIDE_MENU: "[data-cy=testSideMenuClosed]"
    }
};
export default locators;
