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
import { NameSpaceEnum } from "../../types/Namespace";
import { currentNameSpace } from "../../atoms/namespace";
import ReviewTaskAdminToolBar from "../Toolbar/ReviewTaskAdminToolBar";
import { useAppSelector } from "../../store/store";
import { ReviewTaskStates } from "../../machines/reviewTask/enums";

export interface ClaimReviewViewProps {
    personality?: any;
    claim: any;
    content: Content;
    hideDescriptions?: any;
}

const ClaimReviewView = (props: ClaimReviewViewProps) => {
    const { personality, claim, content, hideDescriptions } = props;
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const { reviewDrawerCollapsed } = useAppSelector((state) => ({
        reviewDrawerCollapsed:
            state?.reviewDrawerCollapsed !== undefined
                ? state?.reviewDrawerCollapsed
                : true,
    }));
    const { review } = publishedReview || {};
    const [nameSpace] = useAtom(currentNameSpace);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const [role] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);

    const userIsNotRegular = !(role === Roles.Regular || role === null);
    const userIsReviewer = reviewData.reviewerId === userId;
    const userIsCrossChecker = reviewData.crossCheckerId === userId;
    const userIsAssignee = reviewData.usersId.includes(userId);
    const isContentImage = claim.contentModel === ContentModelEnum.Image;
    const hasStartedTask =
        machineService.state.value !== ReviewTaskStates.unassigned;
    const origin = window.location.origin ? window.location.origin : "";

    const componentStyle = {
        span: 18,
        offset: 3,
    };

    if (!reviewDrawerCollapsed) {
        componentStyle.span = 22;
        componentStyle.offset = 1;
    }

    let contentPath =
        nameSpace !== NameSpaceEnum.Main ? `${nameSpace}/claim` : `/claim`;

    if (personality) {
        contentPath =
            nameSpace !== NameSpaceEnum.Main
                ? `${nameSpace}/personality/${personality?.slug}/claim`
                : `/personality/${personality?.slug}/claim`;
    }

    contentPath += isContentImage
        ? `/${claim?._id}`
        : `/${claim?.slug}/sentence/${content.data_hash}`;
    const href = `${origin}${contentPath}`;

    return (
        <div>
            {(role === Roles.Admin || role === Roles.SuperAdmin) && (
                <>
                    {review?.isPublished ? (
                        <AdminToolBar
                            content={review}
                            deleteApiFunction={ClaimReviewApi.deleteClaimReview}
                            changeHideStatusFunction={
                                ClaimReviewApi.updateClaimReviewHiddenStatus
                            }
                            target={TargetModel.ClaimReview}
                            hideDescriptions={hideDescriptions}
                        />
                    ) : (
                        hasStartedTask && <ReviewTaskAdminToolBar />
                    )}
                </>
            )}
            <ClaimReviewHeader
                classification={
                    review?.report?.classification || reviewData?.classification
                }
                hideDescription={hideDescriptions}
                userIsReviewer={userIsReviewer}
                userIsNotRegular={userIsNotRegular}
                userIsAssignee={userIsAssignee}
                componentStyle={componentStyle}
                {...props}
            />
            <SentenceReportView
                context={review?.report || reviewData}
                userIsNotRegular={userIsNotRegular}
                userIsReviewer={userIsReviewer}
                userIsAssignee={userIsAssignee}
                userIsCrossChecker={userIsCrossChecker}
                isHidden={review?.isHidden}
                href={href}
                componentStyle={componentStyle}
            />

            {!review?.isPublished && (
                <ClaimReviewForm
                    claim={claim}
                    personalityId={personality?._id}
                    dataHash={content.data_hash}
                    userIsReviewer={userIsReviewer}
                    sentenceContent={content.content}
                    componentStyle={componentStyle}
                />
            )}
            {review?.isPublished && (
                <SocialMediaShare
                    quote={personality?.name}
                    href={href}
                    claim={claim?.title}
                />
            )}
        </div>
    );
};

export default ClaimReviewView;
