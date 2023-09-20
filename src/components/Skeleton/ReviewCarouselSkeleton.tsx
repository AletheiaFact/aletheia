import { Skeleton } from "antd";
import React from "react";
import CardBase from "../CardBase";

const ReviewCarouselSkeleton = () => {
    return (
        <CardBase style={{ width: "fit-content", minWidth: "100%" }}>
            <div style={{ flex: 1, padding: "24px 32px" }}>
                <Skeleton active paragraph={{ rows: 5 }} round={true} />
                <div
                    style={{
                        display: "flex",
                        padding: "10px 0",
                    }}
                >
                    <Skeleton title={false} paragraph={{ rows: 1 }} />
                    <Skeleton.Button active />
                </div>
            </div>
        </CardBase>
    );
};

export default ReviewCarouselSkeleton;
