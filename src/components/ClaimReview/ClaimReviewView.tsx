import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { Roles, TargetModel } from "../../types/enums";
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
import { currentNameSpace } from "../../atoms/namespace";
import ReviewTaskAdminToolBar from "../Toolbar/ReviewTaskAdminToolBar";
import { useAppSelector } from "../../store/store";
import { ReviewTaskStates } from "../../machines/reviewTask/enums";
import { generateReviewContentPath } from "../../utils/GetReviewContentHref";

export interface ClaimReviewViewProps {
    content: Content;
    hideDescriptions?: any;
    personality?: any;
    target?: any;
}

const ClaimReviewView = (props: ClaimReviewViewProps) => {
    const { personality, target, content, hideDescriptions } = props;
    const { machineService, publishedReview, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const { vw, reviewDrawerCollapsed } =
        useAppSelector((state) => ({
            vw: state?.vw,
            reviewDrawerCollapsed:
                state?.reviewDrawerCollapsed !== undefined
                    ? state?.reviewDrawerCollapsed
                    : true,
        }));
    const { review } = publishedReview || {};
    const reviewData = useSelector(machineService, reviewDataSelector);
    const [role] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);
    const [nameSpace] = useAtom(currentNameSpace);
    const userIsNotRegular = !(role === Roles.Regular || role === null);
    const userIsReviewer = reviewData.reviewerId === userId;
    const hasStartedTask =
        machineService.state.value !== ReviewTaskStates.unassigned;
    const origin = window.location.origin ? window.location.origin : "";
    const isClaimTypeAndNotSmallScreen = reviewTaskType === "Claim" && !vw.sm || !hasStartedTask || !userIsNotRegular;
    const isSourceOrVerificationRequest = reviewTaskType === "Source" || reviewTaskType === "VerificationRequest";

    const componentStyle = {
        span: 9,
    };

    if (!reviewDrawerCollapsed) {
        componentStyle.span = 11;
    }

    const reviewContentPath = generateReviewContentPath(
        nameSpace,
        personality,
        target,
        target?.contentModel,
        content.data_hash,
        reviewTaskType
    );

    const href = `${origin}${reviewContentPath}`;

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
                            target={TargetModel.ClaimReview} // TODO: rename to review
                            hideDescriptions={hideDescriptions}
                        />
                    ) : (
                        hasStartedTask && <ReviewTaskAdminToolBar />
                    )}
                </>
            )}
            {(isClaimTypeAndNotSmallScreen || isSourceOrVerificationRequest) && (
                <ClaimReviewHeader
                    classification={
                        review?.report?.classification ||
                        reviewData?.classification
                    }
                    hideDescription={hideDescriptions}
                    userIsNotRegular={userIsNotRegular}
                    componentStyle={componentStyle}
                    {...props}
                />
            )}

            <SentenceReportView
                context={review?.report || reviewData}
                userIsNotRegular={userIsNotRegular}
                userIsReviewer={userIsReviewer}
                isHidden={review?.isHidden}
                href={href}
                componentStyle={componentStyle}
                personality={personality}
                content={content}
                claim={target}
            />

            {!review?.isPublished && (
                <ClaimReviewForm
                    personalityId={personality?._id}
                    dataHash={content.data_hash}
                    userIsReviewer={userIsReviewer}
                    componentStyle={componentStyle}
                    target={target}
                />
            )}
            {review?.isPublished && (
                <SocialMediaShare
                    quote={personality?.name}
                    href={href}
                    claim={target?.title}
                />
            )}
        </div>
    );
};

export default ClaimReviewView;
