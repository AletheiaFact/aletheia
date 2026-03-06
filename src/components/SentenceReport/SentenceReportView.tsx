import { useSelector } from "@xstate/react";
import { Grid, Paper, Box, Typography } from "@mui/material";
import React, { useContext, useMemo } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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
import { useTranslation } from "next-i18next";

const SentenceReportView = ({
    context,
    userIsNotRegular,
    isHidden,
    href,
    componentStyle,
}) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const { t } = useTranslation();

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

                    {/* Reviewer instructions banner */}
                    {isLoggedIn &&
                        isReviewing &&
                        (permissions.isReviewer || permissions.isAdmin) && (
                            <Paper
                                elevation={0}
                                style={{
                                    padding: "12px 20px",
                                    margin: "0 0 16px",
                                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                                    border: "1px solid rgba(25, 118, 210, 0.3)",
                                    borderRadius: "8px",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    style={{
                                        color: "rgb(25, 118, 210)",
                                        fontWeight: 500,
                                    }}
                                >
                                    {t("reviewTask:reviewerInstructions")}
                                </Typography>
                            </Paper>
                        )}

                    {/* Rejection comment banner */}
                    {isLoggedIn && context?.rejectionComment && (
                        <Paper
                            elevation={0}
                            style={{
                                padding: "16px 20px",
                                margin: "0 0 16px",
                                backgroundColor: colors.errorTranslucent,
                                border: `1px solid ${colors.error}`,
                                borderRadius: "8px",
                            }}
                        >
                            <Box
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "12px",
                                }}
                            >
                                <ErrorOutlineIcon
                                    style={{
                                        color: colors.error,
                                        fontSize: "22px",
                                        marginTop: "2px",
                                    }}
                                />
                                <div>
                                    <Typography
                                        variant="subtitle2"
                                        style={{
                                            color: colors.error,
                                            fontWeight: 600,
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {t("reviewTask:rejectionCommentTitle")}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        style={{
                                            color: colors.blackSecondary,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {context.rejectionComment}
                                    </Typography>
                                </div>
                            </Box>
                        </Paper>
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
