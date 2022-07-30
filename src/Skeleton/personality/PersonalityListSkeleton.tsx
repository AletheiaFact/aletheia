import { Row } from "antd";
import React from "react";
import PersonalitySkeleton from "./PersonalitySkeleton";

const PersonalityListSkeleton = () => {
    return (
        <Row gutter={40} style={{ marginTop: 32 }}>
            <PersonalitySkeleton />
            <PersonalitySkeleton />
            <PersonalitySkeleton />
            <PersonalitySkeleton />
        </Row>
    );
};

export default PersonalityListSkeleton;
