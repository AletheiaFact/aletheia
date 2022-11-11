import { useTranslation } from "next-i18next";
import React from "react";

import ClaimReviewTaskApi from "../../api/ClaimReviewTaskApi";
import { ReviewTaskStates } from "../../machines/reviewTask/enums";
import KanbanSkeleton from "../Skeleton/KanbanSkeleton";
import colors from "../../styles/colors";
import BaseList from "../List/BaseList";
import EmptyKanbanCol from "./EmptyKanbanCol";
import KanbanCard from "./KanbanCard";
import styled from "styled-components";

const StyledColumn = styled.div`
    .ant-list-item {
        padding: 6px 0;
    }
`;

interface KanbanColProps {
    state: ReviewTaskStates;
    userRole: string;
    isLoggedIn: boolean;
}

const KanbanCol = ({ state, userRole, isLoggedIn }: KanbanColProps) => {
    const { t } = useTranslation();
    return (
        <StyledColumn
            style={{
                padding: "0 10px",
                width: "400px",
                backgroundColor: colors.lightGraySecondary,
                borderRadius: 4,
            }}
        >
            <BaseList
                title={t(`claimReviewTask:${state}`)}
                apiCall={ClaimReviewTaskApi.getClaimReviewTasks}
                filter={{ value: state }}
                renderItem={(task) => (
                    <KanbanCard
                        userRole={userRole}
                        isLoggedIn={isLoggedIn}
                        reviewTask={task}
                    />
                )}
                emptyFallback={
                    <EmptyKanbanCol title={t(`claimReviewTask:${state}`)} />
                }
                showDividers={false}
                skeleton={<KanbanSkeleton />}
            />
        </StyledColumn>
    );
};

export default KanbanCol;
