import { ReviewTaskEvents, ReviewTaskStates } from "./enums";

import visualEditor from "../../components/ClaimReview/form/fieldLists/visualEditor";
import selectReviewer from "../../components/ClaimReview/form/fieldLists/selectReviewerForm";
import unassignedForm from "../../components/ClaimReview/form/fieldLists/unassignedForm";
import crossCheckingForm from "../../components/ClaimReview/form/fieldLists/crossCheckingForm";
import selectCrossCheckerForm from "../../components/ClaimReview/form/fieldLists/selectCrossCheckerForm";
import verificationRequestForm from "../../components/ClaimReview/form/fieldLists/verificationRequestForm";
import rejectionForm from "../../components/ClaimReview/form/fieldLists/rejectionForm";

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

        [ReviewTaskEvents.finishReport]: visualEditor,
        [ReviewTaskStates.reported]: visualEditor,
        [ReviewTaskEvents.submitCrossChecking]: visualEditor,

        [ReviewTaskEvents.selectedCrossChecking]: selectCrossCheckerForm,
        [ReviewTaskStates.selectCrossChecker]: selectCrossCheckerForm,

        [ReviewTaskEvents.selectedReview]: selectReviewer,
        [ReviewTaskStates.selectReviewer]: selectReviewer,

        [ReviewTaskEvents.sendToCrossChecking]: visualEditor,
        [ReviewTaskStates.crossChecking]: visualEditor,

        [ReviewTaskEvents.addComment]: crossCheckingForm,
        [ReviewTaskStates.addCommentCrossChecking]: crossCheckingForm,

        [ReviewTaskEvents.submitComment]: visualEditor,

        [ReviewTaskEvents.sendToReview]: visualEditor,
        [ReviewTaskStates.submitted]: visualEditor,
        [ReviewTaskEvents.addRejectionComment]: rejectionForm,
        [ReviewTaskStates.rejected]: rejectionForm,
        [ReviewTaskEvents.confirmRejection]: rejectionForm,
        [ReviewTaskStates.published]: [],
        [ReviewTaskEvents.publish]: [],

        [ReviewTaskEvents.reset]: verificationRequestForm,
        [ReviewTaskStates.rejectedRequest]: [],
        [ReviewTaskEvents.rejectRequest]: [],
    };

    return formMap[param];
};

export default getNextForm;
