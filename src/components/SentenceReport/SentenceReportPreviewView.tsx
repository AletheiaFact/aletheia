import { useSelector } from "@xstate/react";
import { Grid } from "@mui/material";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { Roles } from "../../types/enums";
import {
    reviewingSelector,
    publishedSelector,
    crossCheckingSelector,
    reportSelector,
    assignedSelector,
} from "../../machines/reviewTask/selectors";
import colors from "../../styles/colors";
import { useAtom } from "jotai";
import { currentUserId, currentUserRole } from "../../atoms/currentUser";
import { ReviewTaskTypeEnum } from "../../../server/types/enums";
import LargeDrawer from "../LargeDrawer";
import SentenceReportPreview from "./SentenceReportPreview";
import { useAppSelector } from "../../store/store";
import ClaimReviewHeader from "../ClaimReview/ClaimReviewHeader";
import { Content } from "../../types/Content";

interface ISentenceReportViewV1Props {
    context: any;
    userIsNotRegular: boolean;
    userIsReviewer: boolean;
    isHidden: boolean;
    href: string;
    componentStyle: any;
    personality?: any;
    content: Content;
    target?: any;
    hideDescriptions?: any;
}

const SentenceReportPreviewView = ({
    context,
    userIsNotRegular,
    userIsReviewer,
    isHidden,
    href,
    componentStyle,
    personality,
    content,
    target,
    hideDescriptions,
}: ISentenceReportViewV1Props) => {
    const { reviewDrawerCollapsed } = useAppSelector((state) => ({
        reviewDrawerCollapsed:
            state?.reviewDrawerCollapsed !== undefined
                ? state?.reviewDrawerCollapsed
                : true,
    }));
    const [role] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);
    const {
        machineService,
        publishedReview,
        reviewTaskType,
        viewPreview,
        handleClickViewPreview,
    } = useContext(ReviewTaskMachineContext);
    const isReport = useSelector(machineService, reportSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isAssigned = useSelector(machineService, assignedSelector);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const userIsAdmin = role === Roles.Admin || role === Roles.SuperAdmin;
    const userIsCrossChecker = context.crossCheckerId === userId;
    const userIsAssignee = context.usersId.includes(userId);

    const isCrossCheckingAndUserHasPermission =
        isCrossChecking && (userIsAdmin || userIsCrossChecker);
    const isReviewingAndUserHasPermission =
        isReviewing && (userIsAdmin || userIsReviewer);
    const isAssignedAndUserHasPermission =
        isAssigned && (userIsAdmin || userIsAssignee || userIsCrossChecker);
    const isReportedAndUserHasPermission =
        isReport && (userIsAdmin || userIsAssignee || userIsCrossChecker);
    const canShowReportPreview =
        isCrossCheckingAndUserHasPermission ||
        isReviewingAndUserHasPermission ||
        isReportedAndUserHasPermission ||
        isAssignedAndUserHasPermission;
    const canShowReport =
        (isPublished && (!isHidden || userIsNotRegular)) ||
        (canShowReportPreview && viewPreview && !reviewDrawerCollapsed);

    return (
        reviewTaskType !== ReviewTaskTypeEnum.VerificationRequest && (
            <Grid
                container
                justifyContent="center"
                style={
                    (isCrossChecking || isReport || isReviewing) && {
                        backgroundColor: colors.lightNeutral,
                    }
                }
            >
                {canShowReport && (
                    <SentenceReportPreview
                        canShowReportPreview={canShowReportPreview}
                        context={context}
                        href={href}
                        componentStyle={componentStyle}
                    />
                )}

                {reviewDrawerCollapsed && (
                    <LargeDrawer
                        onClose={handleClickViewPreview}
                        open={viewPreview}
                    >
                        <Grid
                            item
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 32,
                            }}
                        >
                            <ClaimReviewHeader
                                classification={context.classification}
                                userIsNotRegular={userIsNotRegular}
                                personality={personality}
                                content={content}
                                hideDescription={hideDescriptions}
                                target={target}
                                componentStyle={{
                                    span: 10,
                                }}
                            />
                            <SentenceReportPreview
                                canShowReportPreview={canShowReportPreview}
                                context={context}
                                href={href}
                                componentStyle={{
                                    span: 10,
                                }}
                            />
                        </Grid>
                    </LargeDrawer>
                )}
            </Grid>
        )
    );
};

export default SentenceReportPreviewView;
