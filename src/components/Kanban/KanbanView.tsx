import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import { ReviewTaskStates } from "../../machine/enums";
import ToggleSection from "../ToggleSection";
import KanbanCol from "./KanbanCol";

export interface KanbanProps {
    userId?: string;
}

const KanbanView = ({ userId }: KanbanProps) => {
    const [filterUserTasks, setFilterUserTasks] = useState(false);
    const [filters, setFilters] = useState({});
    const states = Object.keys(ReviewTaskStates);

    const { t } = useTranslation()

    const toggleUserFilter = (shouldSet) => {
        if (shouldSet) {
            setFilters({ userId });
        } else {
            setFilters({});
        }
    };

    useEffect(() => {
        toggleUserFilter(filterUserTasks);
    }, [filterUserTasks]);


    return (
        <Row justify="center" style={{ paddingTop: "5vh" }}>
            <Col span={22}>
                <div style={{ display: 'flex', width: "100%", alignItems: 'center', gap: '1rem' }}>
                    <span>{t('kanban:filterUser')}</span>
                    <ToggleSection
                        defaultValue={false}
                        onChange={() => {
                            setFilterUserTasks(!filterUserTasks);
                        }}
                        labelTrue={t('kanban:filterMyTasks')}
                        labelFalse={t('kanban:filterAllTasks')}
                    />
                </div>
            </Col>
            <Col span={22}>
                <Row>
                    {states.map((state) => {
                        // Don't show unassigned column because we
                        // don't save tasks in this state
                        if (state !== ReviewTaskStates.unassigned) {
                            return (
                                <KanbanCol
                                    key={state}
                                    state={ReviewTaskStates[state]}
                                    filters={filters}
                                />
                            );
                        }
                    })}
                </Row>
            </Col>
        </Row>
    );
};

export default KanbanView;
