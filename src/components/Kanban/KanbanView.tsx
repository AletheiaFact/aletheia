import { Col, Row } from "antd";
import React from "react";

import claimReviewTaskApi from "../../api/ClaimReviewTaskApi";
import { ReviewTaskStates } from "../../machine/enums";
import colors from "../../styles/colors";
import BaseList from "../List/BaseList";
import KanbanCard from "./KanbanCard";
import KanbanCol from "./KanbanCol";

const KanbanView = () => {
    return (
        <Row style={{ margin: "32px" }}>
            <Col span={24}>
                <Row
                    style={{
                        borderRadius: "10px",
                        height: "100%",
                    }}
                >
                    <KanbanCol>
                        <BaseList
                            title={ReviewTaskStates.assigned}
                            apiCall={claimReviewTaskApi.getClaimReviewTasks}
                            filter={{ value: ReviewTaskStates.assigned }}
                            renderItem={task => (
                                <KanbanCard reviewTask={task} />
                            )}
                        />
                    </KanbanCol>

                    <KanbanCol
                        style={{
                            borderLeft: `2px solid ${colors.blackSecondary}`,
                            borderRight: `2px solid ${colors.blackSecondary}`,
                        }}
                    >
                        <BaseList
                            title={ReviewTaskStates.reported}
                            apiCall={claimReviewTaskApi.getClaimReviewTasks}
                            filter={{ value: ReviewTaskStates.reported }}
                            renderItem={task => (
                                <KanbanCard reviewTask={task} />
                            )}
                        />
                    </KanbanCol>

                    <KanbanCol>
                        <BaseList
                            title={ReviewTaskStates.published}
                            apiCall={claimReviewTaskApi.getClaimReviewTasks}
                            filter={{ value: ReviewTaskStates.published }}
                            renderItem={task => (
                                <KanbanCard reviewTask={task} />
                            )}
                        />
                    </KanbanCol>
                </Row>
            </Col>
        </Row>
    );
}

export default KanbanView;
