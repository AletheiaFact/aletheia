import React, { useState, useEffect, useMemo } from "react";
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import { Schedule as ClockIcon } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { ReviewTaskStates } from "../../machines/reviewTask/enums";
import userApi from "../../api/userApi";

interface AssignedFactChecker {
    id: string;
    type: 'reviewer' | 'crossChecker' | 'assignee';
}

interface SentenceReportHeaderProps {
    context: any;
    currentState: string;
    editorConfiguration?: {
        readonly?: boolean;
    };
}

const SentenceReportHeader: React.FC<SentenceReportHeaderProps> = ({
    context,
    currentState,
    editorConfiguration
}) => {
    const { t } = useTranslation();
    const [userNames, setUserNames] = useState<Record<string, string>>({});


    // Main workflow progression - derived from state machine definition
    // This represents the simplified linear view for UI progress indicator
    const getMainWorkflowSteps = useMemo(() => {
        const mainStates = [
            ReviewTaskStates.unassigned,
            ReviewTaskStates.assigned, 
            ReviewTaskStates.reported,
            ReviewTaskStates.crossChecking, // represents reviewing/crossChecking phase
            ReviewTaskStates.published
        ];
        
        return mainStates.map(state => ({
            key: state,
            label: t(`reviewTask:${state}`)
        }));
    }, [t]);

    const workflowSteps = getMainWorkflowSteps;

    // Map complex state machine states to simplified workflow view
    const mapStateToWorkflowStep = (state: string) => {
        // States that map to the reviewing/crossChecking phase
        const reviewingStates = [
            ReviewTaskStates.selectReviewer,
            ReviewTaskStates.selectCrossChecker,
            ReviewTaskStates.crossChecking,
            ReviewTaskStates.addCommentCrossChecking,
            ReviewTaskStates.submitted,
            ReviewTaskStates.rejected
        ];
        
        if (reviewingStates.includes(state as any)) {
            return ReviewTaskStates.crossChecking;
        }
        
        return state;
    };

    const normalizedCurrentState = mapStateToWorkflowStep(currentState);
    const currentStepIndex = workflowSteps.findIndex(step => step.key === normalizedCurrentState);
    const stepStatuses = workflowSteps.map((step, index) => {
        if (index < currentStepIndex) return "complete";
        if (index === currentStepIndex) return "current";
        return "upcoming";
    });

    // Get assigned fact-checker info
    const assignedFactChecker: AssignedFactChecker | null = useMemo(() => {
        if (context.reviewerId) {
            return { id: context.reviewerId, type: 'reviewer' };
        }
        if (context.crossCheckerId) {
            return { id: context.crossCheckerId, type: 'crossChecker' };
        }
        if (context.usersId && context.usersId.length > 0) {
            return { id: context.usersId[0], type: 'assignee' };
        }
        return null;
    }, [context.reviewerId, context.crossCheckerId, context.usersId]);

    // Fetch user names for assigned users
    useEffect(() => {
        const fetchUserNames = async () => {
            const userIds: string[] = [];
            if (context.reviewerId) userIds.push(context.reviewerId);
            if (context.crossCheckerId) userIds.push(context.crossCheckerId);
            if (context.usersId) userIds.push(...context.usersId);

            const names: Record<string, string> = {};
            await Promise.all(
                userIds.map(async (userId) => {
                    try {
                        const user = await userApi.getById(userId);
                        names[userId] = user?.name || user?.email || userId;
                    } catch (error) {
                        names[userId] = userId; // Fallback to ID if fetch fails
                    }
                })
            );
            setUserNames(names);
        };

        if (assignedFactChecker) {
            fetchUserNames();
        }
    }, [context.reviewerId, context.crossCheckerId, context.usersId, assignedFactChecker]);

    // State color mapping
    const getStateColor = (state: string) => {
        switch (state) {
            case ReviewTaskStates.unassigned:
                return 'default';
            case ReviewTaskStates.assigned:
                return 'primary';
            case ReviewTaskStates.submitted:
            case ReviewTaskStates.reviewing:
                return 'warning';
            case ReviewTaskStates.crossChecking:
                return 'info';
            case ReviewTaskStates.reported:
                return 'secondary';
            case ReviewTaskStates.published:
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <Box>
            {/* Enhanced Workflow Status */}
            <Box sx={{ py: 3 }}>
                {/* Current State and Step Counter */}
                <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    mb: 1.5
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ClockIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" fontWeight="600">
                            {t(`reviewTask:${currentState}`)}
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {t("reviewTask:stepCounter", { 
                            current: Math.max(currentStepIndex + 1, 1), 
                            total: workflowSteps.length 
                        })}
                    </Typography>
                </Box>

                {/* Progress Indicator with Dots */}
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    mb: 2,
                    gap: 0
                }}>
                    {workflowSteps.map((step, index) => (
                        <React.Fragment key={step.key}>
                            {/* Step Dot */}
                            <Box
                                sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    backgroundColor: stepStatuses[index] === "complete" 
                                        ? "primary.main"
                                        : stepStatuses[index] === "current"
                                            ? "primary.main"
                                            : "grey.300",
                                    border: stepStatuses[index] === "current" 
                                        ? "2px solid rgba(25, 118, 210, 0.2)"
                                        : "none",
                                    boxShadow: stepStatuses[index] === "current"
                                        ? "0 0 0 2px rgba(25, 118, 210, 0.2)"
                                        : "none",
                                    flexShrink: 0
                                }}
                            />
                            
                            {/* Connecting Line */}
                            {index < workflowSteps.length - 1 && (
                                <Box
                                    sx={{
                                        height: 2,
                                        flex: 1,
                                        backgroundColor: stepStatuses[index] === "complete" 
                                            ? "primary.main" 
                                            : "grey.300",
                                        mx: 0.5
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </Box>

                {/* Status Badges */}
                <Box sx={{ 
                    display: "flex", 
                    flexWrap: "wrap", 
                    gap: 1,
                    alignItems: "center"
                }}>
                    <Chip
                        label={t("reviewTask:userAssigned")}
                        variant="filled"
                        color="default"
                        size="small"
                        sx={{ 
                            height: 20,
                            fontSize: "0.75rem"
                        }}
                    />
                    
                    {assignedFactChecker && (
                        <Chip
                            label={`${t(`common:${assignedFactChecker.type}`)}: ${userNames[assignedFactChecker.id] || assignedFactChecker.id}`}
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ 
                                height: 20,
                                fontSize: "0.75rem"
                            }}
                        />
                    )}

                    {/* View Only indicator */}
                    {editorConfiguration?.readonly && (
                        <Tooltip 
                            title={t('claimReviewForm:viewOnlyMode')}
                            arrow
                            placement="top"
                        >
                            <Chip
                                label={t('common:viewOnly')}
                                color="warning"
                                variant="outlined"
                                size="small"
                                sx={{ 
                                    backgroundColor: 'rgba(255, 193, 7, 0.1)', 
                                    cursor: 'help',
                                    height: 20,
                                    fontSize: "0.75rem"
                                }}
                            />
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default SentenceReportHeader;