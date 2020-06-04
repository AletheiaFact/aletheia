import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import React from "react";

import { ArrowLeftOutlined } from "@ant-design/icons";
function BackButton(props) {
    const { t } = props;

    if (props.location.pathname !== "/") {
        return (
            <a
                className="back-button"
                style={{
                    fontWeight: "bold"
                }}
                onClick={props.history.goBack}
            >
                <ArrowLeftOutlined /> {t("global:back_button")}
            </a>
        );
    } else {
        return <></>;
    }
}

export default withRouter(withTranslation()(BackButton));
