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
    const userIsRevisor = reviewData.revisorId?.[0] === props.userId;
    const userIsAssigned = reviewData.usersId.includes(props.userId);

    const showReport =
        (isPublished && (!claimReview?.isHidden || userIsNotRegular)) ||
        (isCrossChecking && userIsRevisor);

    const showForm =
        !isPublished && ((userIsAssigned && !isCrossChecking) || userIsRevisor);

    return (
        <div>
            <ClaimReviewHeader
                classification={
                    claimReview?.report?.classification ||
                    reviewData?.classification
                }
                isHidden={claimReview?.isHidden}
                hideDescription={description}
                isPublished={isPublished}
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
