import React from "react";

import ReviewTaskApi from "../../api/reviewTaskApi";
import { ReviewTaskStates } from "../../machines/reviewTask/enums";
import KanbanSkeleton from "../Skeleton/KanbanSkeleton";
import colors from "../../styles/colors";
import BaseList from "../List/BaseList";
import EmptyKanbanGrid from "./EmptyKanbanGrid";
import KanbanCard from "./KanbanCard";
import styled from "styled-components";
import { useTranslations } from "next-intl";

const StyledColumn = styled.div`
    padding: 0 10px;
    width: 400px;
    background-color: ${colors.lightNeutralSecondary};
    border-radius: 4px;
`;

interface KanbanColProps {
    nameSpace: string;
    state: ReviewTaskStates;
    reviewTaskType: string;
    filterUser: {
        assigned: boolean;
        crossChecked: boolean;
        reviewed: boolean;
    };
}

const KanbanGrid = ({
    nameSpace,
    state,
    filterUser,
    reviewTaskType,
}: KanbanColProps) => {
    const tReviewTask = useTranslations("reviewTask");

    return (
        <StyledColumn>
            <BaseList
                title={tReviewTask(`${state}`)}
                apiCall={ReviewTaskApi.getReviewTasks}
                filter={{
                    value: state,
                    reviewTaskType,
                    filterUser,
                    nameSpace,
                }}
                renderItem={(task) => (
                    <KanbanCard
                        reviewTask={task}
                        reviewTaskType={reviewTaskType}
                    />
                )}
                emptyFallback={
                    <EmptyKanbanGrid title={tReviewTask(`${state}`)} />
                }
                showDividers={false}
                skeleton={<KanbanSkeleton />}
                style={{ textTransform: "capitalize", padding: "4px 0" }}
            />
        </StyledColumn>
    );
};

export default KanbanGrid;
