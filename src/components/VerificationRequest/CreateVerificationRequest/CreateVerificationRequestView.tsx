import React from "react";
import { Col, Row } from "antd";
import colors from "../../../styles/colors";
import VerificationRequestForm from "./VerificationRequestForm";

const CreateVerificationRequestView = () => {
    return (
        <Row justify="center" style={{ background: colors.lightGray }}>
            <Col span={18}>
                <VerificationRequestForm />
            </Col>
        </Row>
    );
};

export default CreateVerificationRequestView;
