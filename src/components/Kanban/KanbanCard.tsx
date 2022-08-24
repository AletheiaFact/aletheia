import { Avatar, Col, Row, Typography } from "antd";
import React from "react";

import CardBase from "../CardBase";
import UserTag from "./UserTag";

const { Text, Paragraph } = Typography;

const KanbanCard = ({ reviewTask }) => {
    return (
        <a
            href={reviewTask.reviewHref}
            style={{ width: "100%", minWidth: "330px" }}
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
                    </Col>
                    <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Avatar.Group>
                            {reviewTask.usersName &&
                                reviewTask.usersName.map((user, index) => {
                                    return <UserTag user={user} key={index} />;
                                })}
                        </Avatar.Group>
                    </Col>
                </Row>
            </CardBase>
        </a>
    );
};

export default KanbanCard;
