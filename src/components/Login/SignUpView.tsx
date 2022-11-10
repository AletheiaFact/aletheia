import { Col, Row } from "antd";
import React from "react";
import SignUpForm from "./SignUpForm";

const SignUpView = () => {
    return (
        <Row
            justify="center"
            style={{ marginTop: 45, height: "100%", padding: "24px" }}
        >
            <Col xs={22} sm={12}>
                <SignUpForm />
            </Col>
        </Row>
    );
};

export default SignUpView;
