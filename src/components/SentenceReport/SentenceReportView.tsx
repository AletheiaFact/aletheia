import { useSelector } from "@xstate/react";
import { Grid } from "@mui/material";
import React, { useContext, useMemo } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { Roles } from "../../types/enums";
import {
    reviewingSelector,
    publishedSelector,
    crossCheckingSelector,
    reportSelector,
    addCommentCrossCheckingSelector,
    assignedSelector,
} from "../../machines/reviewTask/selectors";
import colors from "../../styles/colors";
import SentenceReportContent from "./SentenceReportContent";
import { useAtom } from "jotai";
import { currentUserId, currentUserRole, isUserLoggedIn } from "../../atoms/currentUser";
import SentenceReportComments from "./SentenceReportComments";
import { ReviewTaskTypeEnum } from "../../../server/types/enums";
import { useTranslation } from "next-i18next";
import { VisualEditorContext } from "../Collaborative/VisualEditorProvider";
import SentenceReportHeader from "./SentenceReportHeader";

const SentenceReportView = ({
    context,
    userIsNotRegular,
    userIsReviewer,
    isHidden,
    href,
    componentStyle,
    personality,
    content,
    claim,
}) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);
    const [loggedIn] = useAtom(isUserLoggedIn);
    const { machineService, publishedReview, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const { editorConfiguration } = useContext(VisualEditorContext);
    // Clean user assignment checks
    const userIsCrossChecker = context.crossCheckerId === userId;
    const userIsAssignee = context.usersId?.includes(userId) || false;
    const isReport = useSelector(machineService, reportSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isAddCommentCrossChecking = useSelector(
        machineService,
        addCommentCrossCheckingSelector
    );
    const isReviewing = useSelector(machineService, reviewingSelector);
    let isAssigned = useSelector(machineService, assignedSelector);
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    
    const userIsAdmin = role === Roles.Admin || role === Roles.SuperAdmin;

    // Simplified logic: Always show report content, just control what's visible inside
    // Reports and drafts are visible to everyone
    const canShowReport = true;
    
    // Show comments/classification based on user permissions
    const canShowClassificationAndCrossChecking =
        ((isCrossChecking || isAddCommentCrossChecking) &&
            (userIsAdmin || userIsCrossChecker)) ||
        (isReviewing && (userIsAdmin || userIsReviewer)) ||
        (isReport && (userIsAdmin || userIsAssignee || userIsCrossChecker));

    // Only show SentenceReportContent if the report is published
    const shouldShowReportContent = useMemo(() => {
        return isPublished || publishedReview?.review;
    }, [isPublished, publishedReview]);

    // Get current state for status display
    const currentState = useMemo(() => {
        const state = machineService.state.value;
        if (typeof state === 'string') return state;
        // Return first state key, or empty string if no state
        const stateKeys = Object.keys(state);
        return stateKeys.length > 0 ? stateKeys[0] : '';
    }, [machineService.state.value]);

    return (
        canShowReport &&
        reviewTaskType !== ReviewTaskTypeEnum.VerificationRequest && (
            <Grid
                container
                justifyContent="center"
                style={
                    isCrossChecking || isReport || isReviewing
                        ? { backgroundColor: colors.lightNeutral }
                        : undefined
                }
            >
                <Grid item xs={componentStyle.span}>
                    {/* Header with status chips - only show to logged-in users when not published */}
                    {loggedIn && !(isPublished || publishedReview?.review) && (
                        <SentenceReportHeader
                            context={context}
                            currentState={currentState}
                            editorConfiguration={editorConfiguration}
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
