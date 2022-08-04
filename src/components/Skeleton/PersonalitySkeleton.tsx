import { Col, Row, Skeleton } from "antd";
import React from "react";

const PersonalitySkeleton = () => {
    return (
        <Row style={{ marginTop: 64, width: "100%" }}>
            <Col span={20} style={{ paddingLeft: 50 }}>
                <Skeleton
                    avatar
                    active
                    paragraph={{ rows: 2, width: ["75%", "50%"] }}
                />
            </Col>
            <Col
                span={4}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "10px 0",
                }}
            >
                <Skeleton.Button active size="large" />
            </Col>
        </Row>
    );
};

export default PersonalitySkeleton;
