import React, { useState } from "react";
import { Row, Col, Card } from "antd";
import colors from "../../styles/colors";
import OryLoginForm from "./OryLoginForm";

const LoginView = (props) => {
    const [formType, setFormType] = useState("login");
    return (
        <>
            <Row justify="center">
                <Col span={24}>
                    <Card
                        style={{
                            marginTop: 45,
                            ...(formType === "signup" && {
                                backgroundColor: colors.bluePrimary
                            })
                        }}
                    >
                        <OryLoginForm />
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default LoginView;
