import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { ContentModelEnum, Roles, TargetModel } from "../../types/enums";
import { reviewDataSelector } from "../../machines/reviewTask/selectors";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import SocialMediaShare from "../SocialMediaShare";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewHeader from "./ClaimReviewHeader";
import { Content } from "../../types/Content";
import { currentUserId, currentUserRole } from "../../atoms/currentUser";
import { useAtom } from "jotai";
import AdminToolBar from "../Toolbar/AdminToolBar";
import ClaimReviewApi from "../../api/claimReviewApi";
export interface ClaimReviewViewProps {
    personality?: any;
    claim: any;
    content: Content;
    hideDescriptions: any;
}

const ClaimReviewView = (props: ClaimReviewViewProps) => {
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const { review } = publishedReview || {};

    const reviewData = useSelector(machineService, reviewDataSelector);
    const [role] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);

    const userIsNotRegular = !(role === Roles.Regular || role === null);
    const userIsReviewer = reviewData.reviewerId === userId;
    const userIsAssignee = reviewData.usersId.includes(userId);

    const { personality, claim, content, hideDescriptions } = props;
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
            {role === Roles.Admin && review?.isPublished && (
                <AdminToolBar
                    content={review}
                    deleteApiFunction={ClaimReviewApi.deleteClaimReview}
                    changeHideStatusFunction={
                        ClaimReviewApi.updateClaimReviewHiddenStatus
                    }
                    target={TargetModel.ClaimReview}
                    hideDescriptions={hideDescriptions}
                />
            )}
            <ClaimReviewHeader
                classification={
                    review?.report?.classification || reviewData?.classification
                }
                hideDescription={hideDescriptions}
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
