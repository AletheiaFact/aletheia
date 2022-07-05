import React from "react";
import { Col, Row } from "antd";
import { ReviewTaskStates } from "../../machine/enums";
import ClaimReviewTaskList from "./ClaimReviewTaskList";
import KanbanCol from "./KanbanCol";
import Subtitle from "../Subtitle";
import colors from "../../styles/colors";

const KanbanView = () => {
    return (
        <Row style={{ margin: "32px" }}>
            <Col span={24}>
                <Row
                    style={{
                        background: colors.bluePrimary,
                        borderRadius: "10px",
                        height: "100%",
                    }}
                >
                    <KanbanCol>
                        <Subtitle style={{ color: colors.white, fontSize: 18 }}>Assigned</Subtitle>
                        <ClaimReviewTaskList value={ReviewTaskStates.assigned} />
                    </KanbanCol>

                    <KanbanCol
                        style={{
                            borderLeft: `2px solid ${colors.blackSecondary}`,
                            borderRight: `2px solid ${colors.blackSecondary}`,
                        }}
                    >
                        <Subtitle style={{ color: colors.white, fontSize: 18 }}>Report</Subtitle>
                        <ClaimReviewTaskList value={ReviewTaskStates.reported} />
                    </KanbanCol>

                    <KanbanCol>
                        <Subtitle style={{ color: colors.white, fontSize: 18 }}>Publish</Subtitle>
                        <ClaimReviewTaskList value={ReviewTaskStates.published} />
                    </KanbanCol>
                </Row>
            </Col>
        </Row>
    );
}

export default KanbanView;
