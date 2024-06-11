import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import colors from "../../../styles/colors";
import DynamicSourceForm from "./DynamicSourceForm";

const CreateSourceView = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    });

    return (
        <Row justify="center" style={{ background: colors.lightGray }}>
            <Col span={18}>{isMounted && <DynamicSourceForm />}</Col>
        </Row>
    );
};

export default CreateSourceView;
