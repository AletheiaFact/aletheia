import { useTranslation } from "next-i18next";
import React, { useEffect } from "react";

import ClaimReviewTaskApi from "../../api/ClaimReviewTaskApi";
import { ReviewTaskStates } from "../../machine/enums";
import BaseList from "../List/BaseList";
import EmptyKanbanCol from "./EmptyKanbanCol";
import KanbanCard from "./KanbanCard";

interface KanbanColProps {
    state: ReviewTaskStates,
}

const KanbanCol = ({ state }: KanbanColProps) => {
    const { t } = useTranslation();
    return (
        <div
            style={{
                padding: 10,
                width: '400px'
            }}
        >
            <BaseList
                title={t(`claimReviewTask:${state}`)}
                apiCall={ClaimReviewTaskApi.getClaimReviewTasks}
                filter={{ value: state }}
                renderItem={task => (
                    <KanbanCard reviewTask={task} />
                )}
                emptyFallback={<EmptyKanbanCol title={t(`claimReviewTask:${state}`)} />}
                showDividers={false}
            />
        </div>
    )
}

export default KanbanCol
