import React from "react";
import { Col } from "antd";

const KabanCol = (props) => {
    return (
        <Col
            span={8}
            style={{
                padding: 10,
                height: "100%",
                ...props.style
            }}
        >
            {props.children}
        </Col>
    )
}

export default KabanCol