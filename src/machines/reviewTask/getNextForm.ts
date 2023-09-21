import { ReviewTaskEvents, ReviewTaskStates } from "./enums";

import assignedCollaborativeForm from "../../components/ClaimReview/form/fieldLists/assignedCollaborativeForm";
import assignedForm from "../../components/ClaimReview/form/fieldLists/assignedForm";
import rejectedForm from "../../components/ClaimReview/form/fieldLists/rejectedForm";
import reportedForm from "../../components/ClaimReview/form/fieldLists/reportedForm";
import summarizedForm from "../../components/ClaimReview/form/fieldLists/summarizedForm";
import unassignedForm from "../../components/ClaimReview/form/fieldLists/unassignedForm";

const getNextForm = (
    param: ReviewTaskEvents | ReviewTaskStates,
    enableCollaborativeEdit?: boolean
) => {
    const formMap = {
        [ReviewTaskStates.unassigned]: unassignedForm,
        [ReviewTaskEvents.assignUser]: enableCollaborativeEdit
            ? assignedCollaborativeForm
            : assignedForm,
        [ReviewTaskStates.assigned]: enableCollaborativeEdit
            ? assignedCollaborativeForm
            : assignedForm,

        [ReviewTaskEvents.finishReport]: reportedForm,
        [ReviewTaskEvents.partialReview]: reportedForm,
        [ReviewTaskStates.reported]: reportedForm,

        [ReviewTaskEvents.submit]: [],
        [ReviewTaskStates.submitted]: [],
        [ReviewTaskStates.rejected]: rejectedForm,
        [ReviewTaskEvents.addRejectionComment]: enableCollaborativeEdit
            ? assignedCollaborativeForm
            : assignedForm,
        [ReviewTaskStates.published]: [],
        [ReviewTaskEvents.publish]: [],
    };

    return formMap[param];
};

export default getNextForm;
