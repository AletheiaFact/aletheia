import { Col, Row } from "antd";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";

import { ReviewTaskStates } from "../../machines/reviewTask/enums";
import KanbanCol from "./KanbanCol";
import { FormControlLabel, Switch } from "@mui/material";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const KanbanView = () => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    // Don't show unassigned, rejected, selectCrossChecker and selectReviewer column
    // because we don't save tasks in these states
    const states = Object.keys(ReviewTaskStates).filter(
        (state) =>
            state !== ReviewTaskStates.unassigned &&
            state !== ReviewTaskStates.selectCrossChecker &&
            state !== ReviewTaskStates.selectReviewer &&
            state !== ReviewTaskStates.addCommentCrossChecking &&
            state !== ReviewTaskStates.rejected
    );
    const [filterUserTasks, setFilterUserTasks] = useState({
        assigned: false,
        crossChecked: false,
        reviewed: false,
    });

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
                            checked={filterUserTasks.assigned}
                            onChange={() =>
                                setFilterUserTasks((prev) => ({
                                    reviewed: false,
                                    crossChecked: false,
                                    assigned: !prev.assigned,
                                }))
                            }
                        />
                    }
                    label={t("kanban:myTasks")}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={filterUserTasks.crossChecked}
                            onChange={() =>
                                setFilterUserTasks((prev) => ({
                                    assigned: false,
                                    reviewed: false,
                                    crossChecked: !prev.crossChecked,
                                }))
                            }
                        />
                    }
                    label={t("kanban:myCrossChecks")}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={filterUserTasks.reviewed}
                            onChange={() =>
                                setFilterUserTasks((prev) => ({
                                    assigned: false,
                                    crossChecked: false,
                                    reviewed: !prev.reviewed,
                                }))
                            }
                        />
                    }
                    label={t("kanban:myReviews")}
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
                            nameSpace={nameSpace}
                            state={ReviewTaskStates[state]}
                            filterUser={filterUserTasks}
                        />
                    );
                })}
            </Col>
        </Row>
    );
};

export default KanbanView;
