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
        const fetchUserNames = async () => {
            const userIds = [];
            if (context.reviewerId) userIds.push(context.reviewerId);
            if (context.crossCheckerId) userIds.push(context.crossCheckerId);
            if (context.usersId) userIds.push(...context.usersId);

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
            setUserNames(names);
        };

        if (assignedFactChecker) {
            fetchUserNames();
        }
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

            {/* Assigned fact-checker chip */}
            {assignedFactChecker && (
                <Chip
                    label={`${assignedFactChecker.type}: ${
                        userNames[assignedFactChecker.id] ||
                        assignedFactChecker.id
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
                    />
                </Box>
            )}
        </Box>
    );
};

export default SentenceReportHeader;
