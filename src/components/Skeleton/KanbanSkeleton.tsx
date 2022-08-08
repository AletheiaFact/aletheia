import { Col, Skeleton } from "antd";
import React from "react";

const KanbanSkeleton = () => {
    return (
        <Col style={{ width: "95%" }}>
            <Skeleton
                style={{ marginTop: 16 }}
                paragraph={{ rows: 1, width: "100%" }}
                active
            />
            <Col
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "10px 0",
                }}
            >
                <Skeleton.Button active style={{ height: 16, width: 150 }} />
            </Col>
        </Col>
    );
};

export default KanbanSkeleton;
