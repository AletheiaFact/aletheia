import { Col, Row } from "antd";
import React from "react";

import OryLoginForm from "./OryLoginForm";

const LoginView = () => {
    return (
        <Row
            justify="center"
            style={{ marginTop: 45, height: "100%", padding: "24px" }}
        >
            <Col span={24}>
                <OryLoginForm />
            </Col>
        </Row>
    );
};

export default LoginView;
