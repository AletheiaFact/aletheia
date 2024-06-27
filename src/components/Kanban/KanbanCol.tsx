import { useTranslation } from "next-i18next";
import React from "react";

import ReviewTaskApi from "../../api/reviewTaskApi";
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
    nameSpace: string;
    state: ReviewTaskStates;
    filterUser: {
        assigned: boolean;
        crossChecked: boolean;
        reviewed: boolean;
    };
}

const KanbanCol = ({ nameSpace, state, filterUser }: KanbanColProps) => {
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
                title={t(`reviewTask:${state}`)}
                apiCall={ReviewTaskApi.getReviewTasks}
                filter={{
                    value: state,
                    filterUser: filterUser,
                    nameSpace,
                }}
                renderItem={(task) => <KanbanCard reviewTask={task} />}
                emptyFallback={
                    <EmptyKanbanCol title={t(`reviewTask:${state}`)} />
                }
                showDividers={false}
                skeleton={<KanbanSkeleton />}
                style={{ textTransform: "capitalize" }}
            />
        </StyledColumn>
    );
};

export default KanbanCol;
