import { withRouter } from "react-router-dom";
import React from "react";

import {
    ArrowLeftOutlined
} from "@ant-design/icons";
function BackButton(props) {
    return (
        <a
            className="back-button"
            style={{
                "font-weight": "bold"
            }}
            onClick={props.history.goBack}
        >
            <ArrowLeftOutlined /> Back
        </a>
    );
}

export default withRouter(BackButton);
