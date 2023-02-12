import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { ContentModelEnum, Roles } from "../../types/enums";
import { reviewDataSelector } from "../../machines/reviewTask/selectors";
import { useAppSelector } from "../../store/store";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import SocialMediaShare from "../SocialMediaShare";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewHeader from "./ClaimReviewHeader";
import { Content } from "../../types/Content";

export interface ClaimReviewViewProps {
    personality?: any;
    claim: any;
    content: Content;
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

    const { personality, claim, content } = props;
    const isContentImage = claim.contentModel === ContentModelEnum.Image;

    const origin =
        typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : "";

    let contentPath = personality
        ? `/personality/${personality?.slug}/claim`
        : `/claim`;
    contentPath += isContentImage
        ? `/${claim?._id}`
        : `/${claim?.slug}/sentence/${content.data_hash}`;
    const shareHref = `${origin}${contentPath}`;

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
                userIsNotRegular={userIsNotRegular}
                userIsReviewer={userIsReviewer}
                isHidden={review?.isHidden}
            />
            <ClaimReviewForm
                claimId={claim._id}
                personalityId={personality?._id}
                dataHash={content.data_hash}
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
