import React from "react";
import { Col, Row } from "antd";
import colors from "../../../styles/colors";
import DynamicVerificationRequestForm from "./DynamicVerificationRequestForm";

const CreateVerificationRequestView = () => {
    return (
        <Row justify="center" style={{ background: colors.lightNeutral }}>
            <Col span={18}>
                <DynamicVerificationRequestForm />
            </Col>
        </Row>
    );
};

export default CreateVerificationRequestView;
