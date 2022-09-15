import { ReviewTaskStates } from "./enums";

const publishedSelector = (state) => {
    return state.matches(ReviewTaskStates.published);
};

const reviewDataSelector = (state) => {
    return state.context.reviewData;
};

export { publishedSelector, reviewDataSelector };
