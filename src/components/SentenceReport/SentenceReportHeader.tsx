import React, { useState, useEffect, useMemo } from "react";
import { Box, Chip, Tooltip } from "@mui/material";
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
        <Box 
            style={{ 
                padding: '16px 20px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                backgroundColor: 'rgba(245, 245, 245, 0.5)',
                borderRadius: '8px'
            }}
        >
            {/* State chip */}
            <Chip
                label={t(`reviewTask:${currentState}`)}
                color={getStateColor(currentState)}
                variant="filled"
                size="medium"
                style={{ fontWeight: 600, fontSize: '0.875rem' }}
            />
            
            {/* Assigned fact-checker chip */}
            {assignedFactChecker && (
                <Chip
                    label={`${t(`common:${assignedFactChecker.type}`)}: ${userNames[assignedFactChecker.id] || assignedFactChecker.id}`}
                    color="primary"
                    variant="outlined"
                    size="medium"
                    style={{ fontWeight: 500, fontSize: '0.875rem' }}
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
                        size="medium"
                        style={{ 
                            backgroundColor: 'rgba(255, 193, 7, 0.1)', 
                            cursor: 'help',
                            fontWeight: 500,
                            fontSize: '0.875rem'
                        }}
                    />
                </Tooltip>
            )}
        </Box>
    );
};

export default SentenceReportHeader;