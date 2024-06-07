import { Row, Col } from "antd";
import React from "react";
import ClaimList from "./ClaimList";
import SourceList from "../Source/SourceList";

const ClaimListView = () => {
    return (
        <>
            <Row justify="center" style={{ marginTop: "64px" }}>
                <Col sm={22} md={14} lg={12}>
                    <SourceList />
                </Col>
                <Col offset={1} sm={22} md={14} lg={8}>
                    <ClaimList columns={1} personality={{ _id: null }} />
                </Col>
            </Row>
        </>
    );
};

export default ClaimListView;
