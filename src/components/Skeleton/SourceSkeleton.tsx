import { Row, Col, Skeleton } from "antd";
import React from "react";
import styled from "styled-components";

const SkeletonCol = styled(Col)`
    .ant-skeleton-element {
        width: 100%;
        border-radius: "10px";
    }
`;

const SourceSkeleton = () => {
    return (
        <Row style={{ marginTop: 14, width: "100%" }}>
            <SkeletonCol span={24}>
                <Skeleton.Image
                    style={{
                        width: "100%",
                        height: "156px",
                        borderRadius: "10px 10px 0 0 ",
                    }}
                />
                <Skeleton active paragraph={{ rows: 2 }} />
            </SkeletonCol>
        </Row>
    );
};

export default SourceSkeleton;
