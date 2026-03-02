import { useSelector } from "@xstate/react";
import { Grid } from "@mui/material";
import React, { useContext, useMemo } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import {
    reviewingSelector,
    publishedSelector,
    crossCheckingSelector,
    reportSelector,
    addCommentCrossCheckingSelector,
} from "../../machines/reviewTask/selectors";
import colors from "../../styles/colors";
<<<<<<< HEAD
import CTAFolder from "../Home/CTAFolder/CTAFolder";
=======
>>>>>>> 0234bfee (feat: implement centralized RBAC permission system with enhanced UX)
import SentenceReportContent from "./SentenceReportContent";
import SentenceReportHeader from "./SentenceReportHeader";
import { useAtom } from "jotai";
import { isUserLoggedIn } from "../../atoms/currentUser";
import SentenceReportComments from "./SentenceReportComments";
import { ReviewTaskTypeEnum } from "../../../server/types/enums";
import { useReviewTaskPermissions } from "../../machines/reviewTask/usePermissions";

const SentenceReportView = ({
    context,
    userIsNotRegular,
    isHidden,
    href,
    componentStyle,
}) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    const { machineService, publishedReview, reviewTaskType, reportModel } =
        useContext(ReviewTaskMachineContext);

    // Centralized permissions (includes debug overrides for assignments and roles)
    const permissions = useReviewTaskPermissions();

    // Machine state selectors (about workflow state, not permissions)
    const isReport = useSelector(machineService, reportSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isAddCommentCrossChecking = useSelector(
        machineService,
        addCommentCrossCheckingSelector
    );
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;

    // Show comments/classification based on centralized permissions + machine state
    const canShowClassificationAndCrossChecking =
        ((isCrossChecking || isAddCommentCrossChecking) &&
            (permissions.isAdmin || permissions.isCrossChecker)) ||
        (isReviewing && (permissions.isAdmin || permissions.isReviewer)) ||
        (isReport &&
            (permissions.isAdmin ||
                permissions.isAssignee ||
                permissions.isCrossChecker));

    // Only show SentenceReportContent if the report is published
    const shouldShowReportContent = useMemo(() => {
        return isPublished || publishedReview?.review;
    }, [isPublished, publishedReview]);

    // Get current state for status display
    const currentState = useMemo(() => {
        const state = machineService.state.value;
        if (typeof state === "string") return state;
        return Object.keys(state)[0] || "unknown";
    }, [machineService.state.value]);

    return (
        reviewTaskType !== ReviewTaskTypeEnum.VerificationRequest && (
            <Grid
                container
                justifyContent="center"
                style={{ backgroundColor: colors.lightNeutral }}
            >
                <Grid item xs={componentStyle.span}>
                    {/* Header with status chips - only show for logged-in users when not published */}
                    {isLoggedIn &&
                        !(isPublished || publishedReview?.review) && (
                            <SentenceReportHeader
                                context={context}
                                currentState={currentState}
                                editorReadonly={permissions.editorReadonly}
                                reportModel={reportModel}
                            />
                        )}

                    {canShowClassificationAndCrossChecking && (
                        <SentenceReportComments context={context} />
                    )}

                    {/* SentenceReportContent section - only show if published */}
                    {shouldShowReportContent && (
                        <SentenceReportContent
                            context={context?.reviewDataHtml || context}
                            classification={context.classification}
                            showClassification={
                                canShowClassificationAndCrossChecking
                            }
                            href={href}
                        />
                    )}
                </Grid>
            </Grid>
        )
    );
};

export default SentenceReportView;
