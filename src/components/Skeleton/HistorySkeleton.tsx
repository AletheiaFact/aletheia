import { Skeleton } from "@mui/material";
import React from "react";

const HistorySkeleton = () => {
    return (
        <Skeleton
            variant="text"
            width="100%"
            animation="wave"
            style={{ marginBottom: 15 }}
        />
    );
};

export default HistorySkeleton;
