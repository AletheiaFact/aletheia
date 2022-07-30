import { Row } from "antd";
import React from "react";
import KanbanSkeleton from "./KanbanSkeleton";

const KanbanListSkeleton = () => {
    return (
        <Row justify="center" gutter={40} style={{ marginTop: 32 }}>
            <KanbanSkeleton />
            <KanbanSkeleton />
        </Row>
    );
};

export default KanbanListSkeleton;
