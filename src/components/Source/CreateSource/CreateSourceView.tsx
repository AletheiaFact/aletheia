import React from "react";
import { Col, Row } from "antd";
import colors from "../../../styles/colors";
import DynamicSourceForm from "./DynamicSourceForm";

const CreateSourceView = () => {
    return (
        <Row justify="center" style={{ background: colors.lightNeutral }}>
            <Col span={18}>
                <DynamicSourceForm />
            </Col>
        </Row>
    );
};

export default CreateSourceView;
