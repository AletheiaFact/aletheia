import { assign } from "xstate"
import assignedForm from "../components/ClaimReview/form/assignedForm";
import { reviewTaskMachineContext } from "./context";
import { AssignEvent } from "./events";
import api from '../api/claimReviewTask'

export const assignedUser = assign<reviewTaskMachineContext, AssignEvent>((context, event) => {
    console.log(context, event)
    const reviewData = {
        userId: event.userId,
        sentence_hash: event.sentence_hash,
    }
    api.createClaimReviewTask({context: reviewData, state: 'assigned'}, event.t).then(() => {console.log('bnanas')})

    return {
        ...context,
        reviewData:{
            ...context.reviewData,
            ...reviewData
        },
        formUi: assignedForm
    };
});
