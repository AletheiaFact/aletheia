import { Col, Skeleton } from "antd";
import React from "react";

const ClaimSkeleton = () => {
    return (
        <Col
            sm={22}
            md={14}
            lg={12}
            style={{
                marginBottom: "10px",
            }}
        >
            <Skeleton
                active
                paragraph={{ rows: 5 }}
                round={true}
                style={{
                    width: "100%",
                }}
            />
            <Col
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "10px 0",
                }}
            >
                <Skeleton title={false} paragraph={{ rows: 1 }} />
                <Skeleton.Button active />
            </Col>
        </Col>
    );
};

export default ClaimSkeleton;
