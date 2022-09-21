import { ReviewTaskEvents, ReviewTaskStates } from "./enums";
import assignedForm from "../components/ClaimReview/form/fieldLists/assignedForm";
import reportedForm from "../components/ClaimReview/form/fieldLists/reportedForm";
import unassignedForm from "../components/ClaimReview/form/fieldLists/unassignedForm";
import submittedForm from "../components/ClaimReview/form/fieldLists/submittedForm";

const getNextForm = (param: ReviewTaskEvents | ReviewTaskStates) => {
    const formMap = {
        // When going back from the 'assigned' to the 'unassigned' state
        // the param received by the function is 0
        0: unassignedForm,
        [ReviewTaskStates.unassigned]: unassignedForm,
        [ReviewTaskEvents.assignUser]: assignedForm,
        [ReviewTaskStates.assigned]: assignedForm,
        [ReviewTaskEvents.finishReport]: reportedForm,
        [ReviewTaskStates.reported]: reportedForm,
        [ReviewTaskEvents.submit]: submittedForm,
        [ReviewTaskStates.submitted]: submittedForm,
        [ReviewTaskEvents.reject]: assignedForm,
        [ReviewTaskStates.published]: [],
        [ReviewTaskEvents.publish]: [],
    };

    return formMap[param];
};

export default getNextForm;
