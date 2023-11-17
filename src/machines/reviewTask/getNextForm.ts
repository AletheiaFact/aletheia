import { ReviewTaskEvents, ReviewTaskStates } from "./enums";

import assignedCollaborativeForm from "../../components/ClaimReview/form/fieldLists/assignedCollaborativeForm";
import assignedForm from "../../components/ClaimReview/form/fieldLists/assignedForm";
import rejectedForm from "../../components/ClaimReview/form/fieldLists/rejectedForm";
import selectReviewer from "../../components/ClaimReview/form/fieldLists/selectReviewerForm";
import unassignedForm from "../../components/ClaimReview/form/fieldLists/unassignedForm";
import submittedForm from "../../components/ClaimReview/form/fieldLists/submittedForm";
import crossCheckingForm from "../../components/ClaimReview/form/fieldLists/crossCheckingForm";
import selectCrossCheckerForm from "../../components/ClaimReview/form/fieldLists/selectCrossCheckerForm";

const getNextForm = (
    param: ReviewTaskEvents | ReviewTaskStates,
    enableCollaborativeEdit?: boolean,
    isSameLabel = false
) => {
    const formMap = {
        [ReviewTaskStates.unassigned]: unassignedForm,
        [ReviewTaskEvents.assignUser]: enableCollaborativeEdit
            ? assignedCollaborativeForm
            : assignedForm,
        [ReviewTaskStates.assigned]: enableCollaborativeEdit
            ? assignedCollaborativeForm
            : assignedForm,

        [ReviewTaskEvents.finishReport]: [],
        [ReviewTaskStates.reported]: [],
        [ReviewTaskEvents.submitCrossChecking]: [],

        [ReviewTaskEvents.selectedCrossChecking]: selectCrossCheckerForm,
        [ReviewTaskStates.selectCrossChecker]: selectCrossCheckerForm,

        [ReviewTaskEvents.selectedReview]: selectReviewer,
        [ReviewTaskStates.selectReviewer]: selectReviewer,

        [ReviewTaskEvents.sendToCrossChecking]: [],
        [ReviewTaskStates.crossChecking]: [],

        [ReviewTaskEvents.addComment]: crossCheckingForm,
        [ReviewTaskStates.addCommentCrossChecking]: crossCheckingForm,

        [ReviewTaskEvents.submitComment]: enableCollaborativeEdit
            ? isSameLabel
                ? []
                : assignedCollaborativeForm
            : assignedForm,

        [ReviewTaskEvents.sendToReview]: [],
        [ReviewTaskStates.submitted]: [],

        [ReviewTaskStates.rejected]: enableCollaborativeEdit
            ? submittedForm
            : rejectedForm,
        [ReviewTaskEvents.addRejectionComment]: enableCollaborativeEdit
            ? assignedCollaborativeForm
            : assignedForm,

        [ReviewTaskStates.published]: [],
        [ReviewTaskEvents.publish]: [],
    };

    return formMap[param];
};

export default getNextForm;
