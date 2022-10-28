import { ReviewTaskEvents, ReviewTaskStates } from "./enums";
import assignedForm from "../components/ClaimReview/form/fieldLists/assignedForm";
import reportedForm from "../components/ClaimReview/form/fieldLists/reportedForm";
import unassignedForm from "../components/ClaimReview/form/fieldLists/unassignedForm";
import rejectedForm from "../components/ClaimReview/form/fieldLists/rejectedForm";
import summarizedForm from "../components/ClaimReview/form/fieldLists/summarizedForm";

const getNextForm = (param: ReviewTaskEvents | ReviewTaskStates) => {
    const formMap = {
        [ReviewTaskStates.unassigned]: unassignedForm,
        [ReviewTaskEvents.assignUser]: assignedForm,
        [ReviewTaskStates.assigned]: assignedForm,

        [ReviewTaskEvents.fullReview]: summarizedForm,
        [ReviewTaskStates.summarized]: summarizedForm,

        [ReviewTaskEvents.finishReport]: reportedForm,
        [ReviewTaskEvents.partialReview]: reportedForm,
        [ReviewTaskStates.reported]: reportedForm,

        [ReviewTaskEvents.submit]: [],
        [ReviewTaskStates.submitted]: [],
        [ReviewTaskStates.rejected]: rejectedForm,
        [ReviewTaskEvents.addRejectionComment]: assignedForm,
        [ReviewTaskStates.published]: [],
        [ReviewTaskEvents.publish]: [],
    };

    return formMap[param];
};

export default getNextForm;
