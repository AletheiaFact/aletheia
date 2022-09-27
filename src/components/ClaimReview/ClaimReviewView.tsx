import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { Roles } from "../../machine/enums";
import {
    crossCheckingSelector,
    publishedSelector,
    reviewDataSelector,
} from "../../machine/selectors";
import { ClaimReviewPageProps } from "../../pages/claim-review";
import { useAppSelector } from "../../store/store";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewHeader from "./ClaimReviewHeader";
import { GlobalStateMachineContext } from "../../Context/GlobalStateMachineProvider";
import SocialMediaShare from "../SocialMediaShare";

const ClaimReviewView = (props: ClaimReviewPageProps) => {
    const { claimReview, description } = props;
    const { machineService } = useContext(GlobalStateMachineContext);

    const reviewData = useSelector(machineService, reviewDataSelector);
    const isPublished = useSelector(machineService, publishedSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);

    const { role } = useAppSelector((state) => state);

    const userIsNotRegular = !(role === Roles.Regular || role === null);
    const userIsRevisor = reviewData.revisorId === props.userId;
    const userIsAssignee = reviewData.usersId.includes(props.userId);

    const showReport =
        (isPublished && (!claimReview?.isHidden || userIsNotRegular)) ||
        (isCrossChecking && userIsRevisor);

    const showForm =
        !isPublished &&
        ((userIsAssignee && !isCrossChecking) ||
            (isCrossChecking && userIsRevisor));

    const showAlert =
        (userIsRevisor && isCrossChecking) ||
        (userIsAssignee &&
            (isCrossChecking || !!reviewData.rejectionComment)) ||
        (isPublished && claimReview?.isHidden);

    let alertDescription = description;
    if (userIsAssignee && !isCrossChecking) {
        alertDescription = reviewData.rejectionComment;
    }

    return (
        <div>
            <ClaimReviewHeader
                classification={
                    claimReview?.report?.classification ||
                    reviewData?.classification
                }
                isHidden={claimReview?.isHidden}
                alertDescription={alertDescription}
                isPublished={isPublished}
                showAlert={showAlert}
                userHasPermission={userIsAssignee || userIsRevisor}
                {...props}
            />
            {showReport && (
                <SentenceReportView
                    context={claimReview?.report || reviewData}
                    personality={props.personality}
                    claim={props.claim}
                />
            )}
            {showForm && <ClaimReviewForm {...props} />}
            <SocialMediaShare
                quote={props.personality?.name}
                href={props.href}
                claim={props.claim?.title}
            />
        </div>
    );
};

export default ClaimReviewView;
