import { assign } from "xstate";
import assignedForm from "../components/ClaimReview/form/assignedForm";
import reportedForm from "../components/ClaimReview/form/reportedForm";
import { ReviewTaskMachineContext } from "./context";
import { AssignEvent, PublishEvent, ReportEvent } from "./events";

export const assignedUser = assign<ReviewTaskMachineContext, AssignEvent>(
    (context, event) => {
        return {
            ...context,
            reviewData: {
                ...context.reviewData,
            },
            formUi: assignedForm,
        };
    }
);

export const report = assign<ReviewTaskMachineContext, ReportEvent>(
    (context, event) => {
        return {
            ...context,
            reviewData: {
                ...context.reviewData,
            },
            formUi: reportedForm,
        };
    }
);

export const publish = assign<ReviewTaskMachineContext, PublishEvent>(
    (context, event) => {
        return {
            ...context,
            reviewData: {
                ...context.reviewData,
            },
            formUi: {},
        };
    }
);
