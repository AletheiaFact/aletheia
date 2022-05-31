import { assign } from "xstate"
import assignedForm from "../components/ClaimReview/form/assignedForm";
import reportedForm from "../components/ClaimReview/form/reportedForm";
import { reviewTaskMachineContext } from "./context";
import { AssignEvent, PublishEvent, ReportEvent } from "./events";

export const assignedUser = assign<reviewTaskMachineContext, AssignEvent>((context, event) => {
    

    return {
        ...context,
        reviewData:{
            ...context.reviewData,
        },
        formUi: assignedForm
    };
});

export const report = assign<reviewTaskMachineContext, ReportEvent>((context, event) => {
    

    return {
        ...context,
        reviewData:{
            ...context.reviewData,
        },
        formUi: reportedForm,
    };
});

export const publish = assign<reviewTaskMachineContext, PublishEvent>((context, event) => {
    

    return {
        ...context,
        reviewData:{
            ...context.reviewData,
        },
        formUi: {},
    };
});