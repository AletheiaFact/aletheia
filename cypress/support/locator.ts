const locators = {
    LOGIN: {
        USER: "#basic_email",
        PASSWORD: "#basic_password",
        BTN_LOGIN: ".ant-btn > span",
    },

    PERSONALITY: {
        BTN_SEE_MORE_PERSONALITY: "[data-cy=testSeeMorePersonality]",
        BTN_ADD_PERSONALITY: "[data-cy=testButtonCreatePersonality]",
        INPUT_SEARCH_PERSONALITY: "[data-cy=testInputSearchPersonality]",
    },

    CLAIM_REVIEW: {
        BTN_START_CLAIM_REVIEW: "[data-cy=testAddReviewButton]",
    },
};
export default locators;
