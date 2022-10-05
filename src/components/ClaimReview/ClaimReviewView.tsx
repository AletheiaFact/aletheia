import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { Roles } from "../../types/enums";
import {
    publishedSelector,
    reviewDataSelector,
} from "../../machines/reviewTask/selectors";
import { ClaimReviewPageProps } from "../../pages/claim-review";
import { useAppSelector } from "../../store/store";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewHeader from "./ClaimReviewHeader";
import { ReviewTaskMachineContext } from "../../Context/ReviewTaskMachineProvider";
import SocialMediaShare from "../SocialMediaShare";

const ClaimReviewView = (props: ClaimReviewPageProps) => {
    const { claimReview, description } = props;
    const { machineService } = useContext(ReviewTaskMachineContext);

    const reviewData = useSelector(machineService, reviewDataSelector);
    const isPublished = useSelector(machineService, publishedSelector);

    const { role } = useAppSelector((state) => state);

    const userIsNotRegular = !(role === Roles.Regular || role === null);
    const userIsReviewer = reviewData.reviewerId === props.userId;
    const userIsAssignee = reviewData.usersId.includes(props.userId);

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
                userIsReviewer={userIsReviewer}
                userIsAssignee={userIsAssignee}
                {...props}
            />
            <SentenceReportView
                context={claimReview?.report || reviewData}
                personality={props.personality}
                claim={props.claim}
                userIsNotRegular={userIsNotRegular}
                userIsReviewer={userIsReviewer}
                isHidden={claimReview?.isHidden}
            />
            <ClaimReviewForm
                claimId={props.claim._id}
                personalityId={props.personality._id}
                sentenceHash={props.sentence.data_hash}
                sitekey={props.sitekey}
                userIsReviewer={userIsReviewer}
                userId={props.userId}
            />
            <SocialMediaShare
                quote={props.personality?.name}
                href={props.href}
                claim={props.claim?.title}
            />
        </div>
    );
};

export default ClaimReviewView;
