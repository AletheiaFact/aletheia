import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

const EmptyKanbanCol = ({ title }) => {
    const { t } = useTranslation()
    return (
        <Row style={{ width: "300px", padding: "12px 0" }}>
            <Row
                style={{
                    fontSize: 18,
                }}
            >
                <span>{title}</span>
            </Row>
            <Row
                style={{
                    width: "100%",
                    alignItems: "center",
                }}
            >
                <Col>
                    {t("list:totalItems", {
                        total: 0
                    })}
                </Col>
            </Row>
        </Row>
    )
}

export default EmptyKanbanCol
