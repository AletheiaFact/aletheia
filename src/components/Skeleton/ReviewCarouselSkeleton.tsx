import { Skeleton } from "@mui/material";
import React from "react";
import CardBase from "../CardBase";

const ReviewCarouselSkeleton = () => {
    return (
        <CardBase style={{ width: "fit-content", minWidth: "100%" }}>
            <div style={{ flex: 1, padding: "24px 32px" }}>
                <Skeleton variant="text" width="30%" animation="wave" />
                <Skeleton variant="text" width="100%" animation="wave" />
                <Skeleton variant="text" width="100%" animation="wave" />
                <Skeleton variant="text" width="100%" animation="wave" />
                <Skeleton variant="text" width="100%" animation="wave" />
                <Skeleton variant="text" width="100%" animation="wave" />
                <Skeleton variant="text" width="60%" animation="wave" />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                    }}
                >
                    <Skeleton variant="text" width="50%" animation="wave" />
                    <Skeleton variant="rectangular" width={60} height={30} animation="wave" />
                </div>
            </div>
        </CardBase>
    );
};

export default ReviewCarouselSkeleton;
