import { Col, Empty, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import ClaimReviewTaskApi from "../../api/ClaimReviewTaskApi";
import { ReviewTaskStates } from "../../machine/enums";
import BaseList from "../List/BaseList";
import EmptyKanbanCol from "./EmptyKanbanCol";
import KanbanCard from "./KanbanCard";

interface KanbanColProps {
    state: ReviewTaskStates
}



const KabanCol = ({ state }: KanbanColProps) => {
    const { t } = useTranslation();
    return (
        <div
            style={{
                padding: 10,
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
            />
        </div>
    )
}

export default KabanCol
