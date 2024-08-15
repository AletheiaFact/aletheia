import React, { useState } from "react";
import { Col, Row } from "antd";
import colors from "../../../styles/colors";
import DynamicVerificationRequestForm from "./DynamicVerificationRequestForm";

const CreateVerificationRequestView = () => {
    return (
        <Row justify="center" style={{ background: colors.lightGray }}>
            <Col span={18}>
                <DynamicVerificationRequestForm />
            </Col>
        </Row>
    );
};

export default CreateVerificationRequestView;
