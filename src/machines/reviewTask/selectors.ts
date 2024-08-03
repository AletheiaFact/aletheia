import { ReviewTaskStates } from "./enums";

const publishedSelector = (state) => {
    return state.matches(ReviewTaskStates.published);
};

const reportSelector = (state) => {
    return (
        state.matches(ReviewTaskStates.reported) ||
        state.matches(ReviewTaskStates.selectCrossChecker) ||
        state.matches(ReviewTaskStates.selectReviewer)
    );
};

const crossCheckingSelector = (state) => {
    return (
        state.matches(ReviewTaskStates.crossChecking) ||
        state.matches(ReviewTaskStates.addCommentCrossChecking)
    );
};

const reviewingSelector = (state) => {
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

export {
    publishedSelector,
    crossCheckingSelector,
    reviewingSelector,
    reviewNotStartedSelector,
    reviewDataSelector,
    reportSelector,
};
