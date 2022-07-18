import { Col, Row } from "antd";
import React from "react";

import { ReviewTaskStates } from "../../machine/enums";
import KanbanCol from "./KanbanCol";


const KanbanView = () => {
    const states = Object.keys(ReviewTaskStates);

    return (
        <Row justify="center" style={{ paddingTop: "5vh" }}>
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
