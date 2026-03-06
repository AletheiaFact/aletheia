import { Box, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import {
    ReviewTaskStates,
    ReportModelEnum,
} from "../../machines/reviewTask/enums";
import colors from "../../styles/colors";

interface StageConfig {
    labelKey: string;
    states: string[];
}

const WORKFLOW_STAGES: Record<string, StageConfig[]> = {
    [ReportModelEnum.FactChecking]: [
        {
            labelKey: "stageAssign",
            states: [ReviewTaskStates.unassigned],
        },
        {
            labelKey: "stageDraft",
            states: [
                ReviewTaskStates.assigned,
                ReviewTaskStates.reported,
                ReviewTaskStates.selectReviewer,
                ReviewTaskStates.selectCrossChecker,
                ReviewTaskStates.rejected,
            ],
        },
        {
            labelKey: "stageReview",
            states: [
                ReviewTaskStates.crossChecking,
                ReviewTaskStates.addCommentCrossChecking,
            ],
        },
        {
            labelKey: "stageApproval",
            states: [ReviewTaskStates.submitted],
        },
        {
            labelKey: "stagePublished",
            states: [ReviewTaskStates.published],
        },
    ],
    [ReportModelEnum.InformativeNews]: [
        {
            labelKey: "stageDraft",
            states: [ReviewTaskStates.assigned],
        },
        {
            labelKey: "stageReview",
            states: [ReviewTaskStates.reported],
        },
        {
            labelKey: "stagePublished",
            states: [ReviewTaskStates.published],
        },
    ],
    [ReportModelEnum.Request]: [
        {
            labelKey: "stageAssign",
            states: [ReviewTaskStates.unassigned],
        },
        {
            labelKey: "stageAssigned",
            states: [ReviewTaskStates.assignedRequest],
        },
        {
            labelKey: "stagePublished",
            states: [
                ReviewTaskStates.published,
                ReviewTaskStates.rejectedRequest,
            ],
        },
    ],
};

interface WorkflowProgressProps {
    currentState: string;
    reportModel: string;
    hasRejection?: boolean;
}

const WorkflowProgress = ({
    currentState,
    reportModel,
    hasRejection,
}: WorkflowProgressProps) => {
    const { t } = useTranslation("reviewTask");

    const stages = WORKFLOW_STAGES[reportModel];

    const activeIndex = useMemo(() => {
        if (!stages) return -1;
        return stages.findIndex((stage) => stage.states.includes(currentState));
    }, [stages, currentState]);

    if (!stages || activeIndex === -1) return null;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                padding: "12px 20px",
                gap: { xs: "4px", sm: "0" },
            }}
        >
            {stages.map((stage, index) => {
                const isCompleted = index < activeIndex;
                const isActive = index === activeIndex;
                const isRejected =
                    isActive &&
                    (currentState === ReviewTaskStates.rejected ||
                        hasRejection);
                const dotColor = isRejected ? colors.error : colors.primary;

                return (
                    <React.Fragment key={stage.labelKey}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "4px",
                                minWidth: { xs: "auto", sm: "60px" },
                            }}
                        >
                            {/* Dot */}
                            <Box
                                sx={{
                                    width: isActive ? 14 : 10,
                                    height: isActive ? 14 : 10,
                                    borderRadius: "50%",
                                    backgroundColor: isCompleted
                                        ? colors.primary
                                        : isActive
                                        ? dotColor
                                        : "transparent",
                                    border: `2px solid ${
                                        isCompleted
                                            ? colors.primary
                                            : isActive
                                            ? dotColor
                                            : colors.neutralTertiary
                                    }`,
                                    boxShadow: isActive
                                        ? `0 0 0 3px ${
                                              isRejected
                                                  ? "rgba(211, 47, 47, 0.2)"
                                                  : "rgba(17, 39, 58, 0.2)"
                                          }`
                                        : "none",
                                    transition: "all 0.2s ease",
                                    flexShrink: 0,
                                }}
                            />
                            {/* Label (hidden on xs) */}
                            <Typography
                                variant="caption"
                                sx={{
                                    display: { xs: "none", sm: "block" },
                                    color: isActive
                                        ? isRejected
                                            ? colors.error
                                            : colors.primary
                                        : isCompleted
                                        ? colors.secondary
                                        : colors.neutralSecondary,
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: "0.7rem",
                                    textAlign: "center",
                                    lineHeight: 1.2,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {t(stage.labelKey)}
                            </Typography>
                        </Box>
                        {/* Connecting line */}
                        {index < stages.length - 1 && (
                            <Box
                                sx={{
                                    flex: 1,
                                    height: "2px",
                                    backgroundColor:
                                        index < activeIndex
                                            ? colors.primary
                                            : colors.neutralTertiary,
                                    marginBottom: { xs: "0", sm: "18px" },
                                    minWidth: "12px",
                                    transition: "background-color 0.2s ease",
                                }}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </Box>
    );
};

export default WorkflowProgress;
