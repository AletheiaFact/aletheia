import { Skeleton } from "antd";
import React from "react";

const HistorySkeleton = () => {
    return (
        <Skeleton
            style={{ marginTop: 16 }}
            title={false}
            paragraph={{ rows: 1, width: "100%" }}
            active
        />
    );
};

export default HistorySkeleton;
