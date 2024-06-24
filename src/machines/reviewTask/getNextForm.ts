import { ReviewTaskEvents, ReviewTaskStates } from "./enums";

import visualEditor from "../../components/ClaimReview/form/fieldLists/visualEditor";
import selectReviewer from "../../components/ClaimReview/form/fieldLists/selectReviewerForm";
import unassignedForm from "../../components/ClaimReview/form/fieldLists/unassignedForm";
import submittedForm from "../../components/ClaimReview/form/fieldLists/submittedForm";
import crossCheckingForm from "../../components/ClaimReview/form/fieldLists/crossCheckingForm";
import selectCrossCheckerForm from "../../components/ClaimReview/form/fieldLists/selectCrossCheckerForm";
import verificationRequestForm from "../../components/ClaimReview/form/fieldLists/verificationRequestForm";

const getNextForm = (
    param: ReviewTaskEvents | ReviewTaskStates,
    isSameLabel = false
) => {
    const formMap = {
        [ReviewTaskStates.unassigned]: unassignedForm,
        [ReviewTaskEvents.assignUser]: visualEditor,
        [ReviewTaskStates.assigned]: visualEditor,
        [ReviewTaskEvents.assignRequest]: verificationRequestForm,
        [ReviewTaskStates.assignedRequest]: verificationRequestForm,

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

        [ReviewTaskEvents.submitComment]: isSameLabel ? [] : visualEditor,

        [ReviewTaskEvents.sendToReview]: [],
        [ReviewTaskStates.submitted]: [],
        [ReviewTaskStates.rejected]: submittedForm,
        [ReviewTaskEvents.addRejectionComment]: visualEditor,
        [ReviewTaskStates.published]: [],
        [ReviewTaskEvents.publish]: [],

        [ReviewTaskEvents.reset]: verificationRequestForm,
        [ReviewTaskStates.rejectedRequest]: [],
        [ReviewTaskEvents.rejectRequest]: [],
    };

    return formMap[param];
};

export default getNextForm;
