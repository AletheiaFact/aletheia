import { Row } from "antd";
import React from "react";
import ClaimSkeleton from "./ClaimSkeleton";

const ClaimListSkeleton = () => {
    return (
        <Row gutter={40} style={{ marginTop: 32 }}>
            <ClaimSkeleton />
            <ClaimSkeleton />
            <ClaimSkeleton />
            <ClaimSkeleton />
        </Row>
    );
};

export default ClaimListSkeleton;
