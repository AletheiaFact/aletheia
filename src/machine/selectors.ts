import { ReviewTaskStates } from "./enums";

const publishedSelector = (state) => {
    return state.matches(ReviewTaskStates.published);
};

const crossCheckingSelector = (state) => {
    return (
        state.matches(ReviewTaskStates.submitted) ||
        state.matches(ReviewTaskStates.rejected)
    );
};

const reviewDataSelector = (state) => {
    return state.context.reviewData;
};

export { publishedSelector, crossCheckingSelector, reviewDataSelector };
