import { Col, Row, Typography } from "antd";
import React from "react";

import CardBase from "../CardBase";

const { Text, Paragraph } = Typography;

const KanbanCard = ({ reviewTask }) => {
    console.log(reviewTask);
    return (
        <a
            href={reviewTask.reviewHref}
            style={{ width: "100%", minWidth: "320px" }}
        >
            <CardBase
                style={{
                    borderRadius: 4,
                    marginBottom: 0,
                    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Row style={{ width: "100%", padding: "10px" }}>
                    <Col
                        span={24}
                        style={{ display: "flex", flexDirection: "column" }}
                    >
                        <Paragraph
                            ellipsis={{
                                rows: 2,
                                expandable: false,
                            }}
                            style={{
                                fontSize: 14,
                                fontWeight: "bold",
                            }}
                        >
                            {reviewTask.sentenceContent}
                        </Paragraph>
                        <Text>{reviewTask.personalityName}</Text>
                        <Text
                            style={{
                                fontSize: 12,
                                width: "100%",
                            }}
                        >
                            {reviewTask.usersName &&
                                reviewTask.usersName.map((user, index) => {
                                    return (
                                        <>
                                            <span style={{ marginRight: 5 }}>
                                                {user}
                                                {reviewTask.usersName.length -
                                                    1 <=
                                                index ? (
                                                    <></>
                                                ) : (
                                                    ","
                                                )}
                                            </span>
                                        </>
                                    );
                                })}
                        </Text>
                    </Col>
                </Row>
            </CardBase>
        </a>
    );
};

export default KanbanCard;
