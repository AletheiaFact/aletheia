import { Col, Row } from "antd";
import React from "react";

import { ReviewTaskStates } from "../../machine/enums";
import KanbanCol from "./KanbanCol";

const KanbanView = () => {
    const states = Object.keys(ReviewTaskStates)
    console.log(states)
    return (
        <Row justify="center" style={{ paddingTop: '5vh' }}>
            <Col span={22}>
                <Row>
                    {states.map(state => {
                        if (state !== ReviewTaskStates.unassigned) {
                            return (
                                <KanbanCol state={ReviewTaskStates[state]} />)
                        }
                    })}
                </Row>
            </Col>
        </Row>
    );
}

export default KanbanView;
