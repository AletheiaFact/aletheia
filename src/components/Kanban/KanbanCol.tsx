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
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const StyledColumn = styled.div`
    .ant-list-item {
        padding: 6px 0;
    }
`;

interface KanbanColProps {
    state: ReviewTaskStates;
    filterUser: boolean;
}

const KanbanCol = ({ state, filterUser }: KanbanColProps) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
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
                filter={{
                    value: state,
                    filterUser: filterUser,
                    nameSpace,
                }}
                renderItem={(task) => <KanbanCard reviewTask={task} />}
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
