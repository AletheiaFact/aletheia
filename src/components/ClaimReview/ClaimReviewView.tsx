import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { GlobalStateMachineContext } from "../../Context/GlobalStateMachineProvider";
import { Roles } from "../../machine/enums";
import { reviewDataSelector } from "../../machine/selectors";
import { useAppSelector } from "../../store/store";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewHeader from "./ClaimReviewHeader";

export interface ClaimReviewViewProps {
    personality: any;
    claim: any;
    sentence: { data_hash: string; content: string; topics: string[] };
    userId?: string;
}

const ClaimReviewView = (props: ClaimReviewViewProps) => {
    const { machineService, publishedReview } = useContext(
        GlobalStateMachineContext
    );
    const { review, descriptionForHide } = publishedReview || {};

    const reviewData = useSelector(machineService, reviewDataSelector);

    const { role } = useAppSelector((state) => state);

    const userIsNotRegular = !(role === Roles.Regular || role === null);
    const userIsReviewer = reviewData.reviewerId === props.userId;
    const userIsAssignee = reviewData.usersId.includes(props.userId);

    return (
        <div>
            <ClaimReviewHeader
                classification={
                    review?.report?.classification || reviewData?.classification
                }
                hideDescription={descriptionForHide}
                userIsReviewer={userIsReviewer}
                userIsNotRegular={userIsNotRegular}
                userIsAssignee={userIsAssignee}
                {...props}
            />
            <SentenceReportView
                context={review?.report || reviewData}
                personality={props.personality}
                claim={props.claim}
                userIsNotRegular={userIsNotRegular}
                userIsReviewer={userIsReviewer}
                isHidden={review?.isHidden}
            />
            <ClaimReviewForm
                claimId={props.claim._id}
                personalityId={props.personality._id}
                sentenceHash={props.sentence.data_hash}
                userIsReviewer={userIsReviewer}
                userId={props.userId}
            />
        </div>
    );
};

export default ClaimReviewView;
