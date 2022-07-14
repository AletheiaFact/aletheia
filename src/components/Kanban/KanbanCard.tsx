import React from "react";
import { Avatar, Col, Row } from "antd";
import { Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import CardBase from "../CardBase";

const { Title } = Typography

const KanbanCard = ({ reviewTask }) => {
    return (
        <CardBase>
            <Row style={{ padding: "10px", width: "100%" }}>
                <Col style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                }}>
                    <Avatar size={20} icon={<UserOutlined />} />
                    <Title
                        level={3}
                        style={{
                            fontSize: 16,
                            lineHeight: "20px",
                            margin: "0 0 0 5px",
                        }}
                    >
                        {reviewTask.userName}
                    </Title>
                </Col>
                <Col>
                    <Title
                        level={3}
                        style={{
                            fontSize: 18,
                            lineHeight: "24px",
                            width: "100%",
                        }}
                    >
                        {reviewTask.sentence_hash}
                    </Title>
                </Col>
            </Row>
        </CardBase>
    );
}

export default KanbanCard;
