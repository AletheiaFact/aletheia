import { Col, Row } from "antd";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";

import { ReviewTaskStates } from "../../machines/reviewTask/enums";
import KanbanCol from "./KanbanCol";
import { FormControlLabel, Switch } from "@mui/material";

const KanbanView = (props) => {
    // Don't show unassigned and rejected column
    // because we don't save tasks in these states
    const { t } = useTranslation();
    const states = Object.keys(ReviewTaskStates).filter(
        (state) =>
            state !== ReviewTaskStates.unassigned &&
            state !== ReviewTaskStates.rejected
    );
    const [filterUser, setFilterUser] = useState(false);
    return (
        <Row justify="center" style={{ padding: "3vh 0", height: "100%" }}>
            <Col
                span={24}
                style={{
                    flexWrap: "nowrap",
                    width: "100%",
                    padding: "1vh 5vh 0vh 5vh",
                }}
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={filterUser}
                            onChange={() => setFilterUser(!filterUser)}
                        />
                    }
                    label={t("kanban:myTasks")}
                />
            </Col>
            <Col
                span={23}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    overflowX: "auto",
                    gap: 12,
                }}
            >
                {states.map((state) => {
                    return (
                        <KanbanCol
                            key={state}
                            state={ReviewTaskStates[state]}
                            filterUser={filterUser}
                        />
                    );
                })}
            </Col>
        </Row>
    );
};

export default KanbanView;
