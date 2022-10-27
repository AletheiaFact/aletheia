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

const reviewNotStartedSelector = (state) => {
    return state.matches(ReviewTaskStates.unassigned);
};

const reviewDataSelector = (state) => {
    return state.context.reviewData;
};

const isPartialReviewSelector = (state) => {
    return state.context.claimReview.isPartialReview || false;
};

const preloadedOptionsSelector = (state) => {
    return state.context.preloadedOptions;
};

export {
    publishedSelector,
    crossCheckingSelector,
    reviewNotStartedSelector,
    reviewDataSelector,
    preloadedOptionsSelector,
    isPartialReviewSelector,
};
