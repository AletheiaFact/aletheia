import { ReviewTaskStates } from "./enums";

const publishedSelector = (state) => {
    return state.matches(ReviewTaskStates.published);
};

const assignedSelector = (state) => {
    return state.matches(ReviewTaskStates.assigned);
};

const reportSelector = (state) => {
    return (
        state.matches(ReviewTaskStates.reported) ||
        state.matches(ReviewTaskStates.selectCrossChecker) ||
        state.matches(ReviewTaskStates.selectReviewer)
    );
};

const crossCheckingSelector = (state) => {
    return state.matches(ReviewTaskStates.crossChecking);
};

const addCommentCrossCheckingSelector = (state) => {
    return state.matches(ReviewTaskStates.addCommentCrossChecking);
};

const reviewingSelector = (state) => {
    return state.matches(ReviewTaskStates.submitted);
};

const rejectedSelector = (state) => {
    return state.matches(ReviewTaskStates.rejected);
};

const reviewNotStartedSelector = (state) => {
    return state.matches(ReviewTaskStates.unassigned);
};

const reviewDataSelector = (state) => {
    return state.context.reviewData;
};

const currentStateSelector = (state) => {
    const value = state.value;
    return typeof value === "string" ? value : Object.keys(value)[0];
};

export {
    publishedSelector,
    crossCheckingSelector,
    addCommentCrossCheckingSelector,
    reviewingSelector,
    rejectedSelector,
    reviewNotStartedSelector,
    reviewDataSelector,
    reportSelector,
    assignedSelector,
    currentStateSelector,
};
