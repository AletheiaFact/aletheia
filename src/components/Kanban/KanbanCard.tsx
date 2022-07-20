import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";

import CardBase from "../CardBase";

const { Text } = Typography;

const KanbanCard = ({ reviewTask }) => {
    const { t } = useTranslation();
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
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "bold",
                            }}
                        >
                            {reviewTask.claimTitle}
                        </Text>
                        <Text>
                            {t("kanban:claimBy")} {reviewTask.personalityName}
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                width: "100%",
                            }}
                        >
                            {t("kanban:assignedTo")}: {reviewTask.userName}
                        </Text>
                        <Text
                            style={{
                                color: colors.bluePrimary,
                                fontWeight: "bold",
                                fontSize: 12,
                                textDecoration: "underline",
                                textAlign: "right",
                            }}
                        >
                            #{reviewTask.sentence_hash}
                        </Text>
                    </Col>
                </Row>
            </CardBase>
        </a>
    );
};

export default KanbanCard;
