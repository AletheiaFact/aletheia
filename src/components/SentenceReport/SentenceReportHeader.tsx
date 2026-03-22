import { Box, Chip, Tooltip } from "@mui/material";
import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import userApi from "../../api/userApi";
import { ReviewTaskStates } from "../../machines/reviewTask/enums";
import WorkflowProgress from "./WorkflowProgress";

interface SentenceReportHeaderProps {
    context: any;
    currentState: string;
    editorReadonly: boolean;
    reportModel?: string;
}

const SentenceReportHeader = ({
    context,
    currentState,
    editorReadonly,
    reportModel,
}: SentenceReportHeaderProps) => {
    const { t } = useTranslation(["reviewTask", "claimReviewForm", "common"]);

    const [userNames, setUserNames] = useState({});

    const assignedFactChecker = useMemo(() => {
        if (context.reviewerId) {
            return {
                id: context.reviewerId,
                type: t("claimReviewForm:reviewerChipLabel"),
            };
        }
        if (context.crossCheckerId) {
            return {
                id: context.crossCheckerId,
                type: t("claimReviewForm:crossCheckerChipLabel"),
            };
        }
        if (context.usersId && context.usersId.length > 0) {
            return {
                id: context.usersId[0],
                type: t("claimReviewForm:assigneeChipLabel"),
            };
        }
        return null;
    }, [context.reviewerId, context.crossCheckerId, context.usersId, t]);

    useEffect(() => {
        let cancelled = false;

        const fetchUserNames = async () => {
            const rawIds = [];
            if (context.reviewerId) rawIds.push(context.reviewerId);
            if (context.crossCheckerId) rawIds.push(context.crossCheckerId);
            if (context.usersId) rawIds.push(...context.usersId);
            const userIds = [...new Set(rawIds)];

            const names = {};
            await Promise.all(
                userIds.map(async (id) => {
                    try {
                        const user = await userApi.getById(id);
                        names[id] = user?.name || user?.email || id;
                    } catch (error) {
                        names[id] = id;
                    }
                })
            );
            if (!cancelled) {
                setUserNames(names);
            }
        };

        if (assignedFactChecker) {
            fetchUserNames();
        }

        return () => {
            cancelled = true;
        };
    }, [
        context.reviewerId,
        context.crossCheckerId,
        context.usersId,
        assignedFactChecker,
    ]);

    const getStateColor = (state: string) => {
        switch (state) {
            case ReviewTaskStates.unassigned:
                return "default";
            case ReviewTaskStates.assigned:
                return "primary";
            case ReviewTaskStates.reported:
                return "secondary";
            case ReviewTaskStates.selectReviewer:
            case ReviewTaskStates.selectCrossChecker:
                return "secondary";
            case ReviewTaskStates.crossChecking:
            case ReviewTaskStates.addCommentCrossChecking:
                return "info";
            case ReviewTaskStates.submitted:
                return "warning";
            case ReviewTaskStates.rejected:
                return "error";
            case ReviewTaskStates.published:
                return "success";
            default:
                return "default";
        }
    };

    return (
        <Box
            style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
            }}
        >
            {/* State chip */}
            <Chip
                label={t(`reviewTask:${currentState}`) || currentState}
                color={getStateColor(currentState)}
                variant="filled"
                size="medium"
                style={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                }}
            />

            {/* Rejected indicator when task was returned from rejection */}
            {context?.rejectionComment &&
                currentState !== ReviewTaskStates.rejected && (
                    <Chip
                        label={t("reviewTask:rejected")}
                        color="error"
                        variant="filled"
                        size="medium"
                        style={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                        }}
                    />
                )}

            {/* Assigned fact-checker chip — only render after name is resolved */}
            {assignedFactChecker && userNames[assignedFactChecker.id] && (
                <Chip
                    label={`${assignedFactChecker.type}: ${
                        userNames[assignedFactChecker.id]
                    }`}
                    color="primary"
                    variant="outlined"
                    size="medium"
                    style={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                    }}
                />
            )}

            {/* View Only indicator */}
            {editorReadonly && (
                <Tooltip
                    title={
                        t("claimReviewForm:viewOnlyMode") ||
                        "You are viewing this report in read-only mode. The content is visible but cannot be edited."
                    }
                    arrow
                    placement="top"
                >
                    <Chip
                        label={t("common:viewOnly") || "View Only"}
                        color="warning"
                        variant="outlined"
                        size="medium"
                        style={{
                            backgroundColor: "rgba(255, 193, 7, 0.1)",
                            cursor: "help",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                        }}
                    />
                </Tooltip>
            )}

            {/* Workflow progress bar */}
            {reportModel && (
                <Box style={{ width: "100%" }}>
                    <WorkflowProgress
                        currentState={currentState}
                        reportModel={reportModel}
                        hasRejection={!!context?.rejectionComment}
                    />
                </Box>
            )}
        </Box>
    );
};

export default SentenceReportHeader;
