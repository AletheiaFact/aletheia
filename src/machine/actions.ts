import { assign } from "xstate"
import assignedForm from "../components/ClaimReview/form/assignedForm";
import reportedForm from "../components/ClaimReview/form/reportedForm";
import { reviewTaskMachineContext } from "./context";
import { AssignEvent, ReportEvent } from "./events";
import api from '../api/claimReviewTask'

export const assignedUser = assign<reviewTaskMachineContext, AssignEvent>((context, event) => {
    const sentence_hash = event.sentence_hash
    const reviewData = {
        userId: event.userId,
    }
    api.createClaimReviewTask({sentence_hash, context: reviewData, state: 'assigned'}, event.t)

    return {
        ...context,
        reviewData:{
            ...context.reviewData,
            ...reviewData
        },
        formUi: assignedForm
    };
});

export const report = assign<reviewTaskMachineContext, ReportEvent>((context, event) => {
    const sentence_hash = event.sentence_hash
    const reviewData = {
        summary: event.summary,
        questions: event.questions,
        report: event.report,
        verification: event.verification,
        source: event.source,
    }
    api.updateClaimReviewTask({sentence_hash, context: reviewData, state: 'reported'}, event.t)

    return {
        ...context,
        reviewData:{
            ...context.reviewData,
            ...reviewData
        },
        formUi: reportedForm,
    };
});
