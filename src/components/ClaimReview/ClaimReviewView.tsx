import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../Context/ReviewTaskMachineProvider";
import { Roles } from "../../machine/enums";
import { reviewDataSelector } from "../../machine/selectors";
import { useAppSelector } from "../../store/store";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import SocialMediaShare from "../SocialMediaShare";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewHeader from "./ClaimReviewHeader";

export interface ClaimReviewViewProps {
    personality: any;
    claim: any;
    sentence: { data_hash: string; content: string; topics: string[] };
}

const ClaimReviewView = (props: ClaimReviewViewProps) => {
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const { review, descriptionForHide } = publishedReview || {};

    const reviewData = useSelector(machineService, reviewDataSelector);

    const { role, userId } = useAppSelector((state) => state);

    const userIsNotRegular = !(role === Roles.Regular || role === null);
    const userIsReviewer = reviewData.reviewerId === userId;
    const userIsAssignee = reviewData.usersId.includes(userId);

    const { personality, claim, sentence } = props;

    const origin =
        typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : "";

    const sentencePath = `/personality/${personality?.slug}/claim/${claim?.slug}/sentence/${sentence.data_hash}`;
    const shareHref = `${origin}${sentencePath}`;

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
                personality={personality}
                claim={claim}
                userIsNotRegular={userIsNotRegular}
                userIsReviewer={userIsReviewer}
                isHidden={review?.isHidden}
            />
            <ClaimReviewForm
                claimId={claim._id}
                personalityId={personality._id}
                sentenceHash={sentence.data_hash}
                userIsReviewer={userIsReviewer}
            />
            <SocialMediaShare
                quote={personality?.name}
                href={shareHref}
                claim={claim?.title}
            />
        </div>
    );
};

export default ClaimReviewView;
