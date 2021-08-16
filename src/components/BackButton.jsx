import { withTranslation } from "react-i18next";
import React from "react";

import { ArrowLeftOutlined } from "@ant-design/icons";
function BackButton(props) {
    const { t } = props;
    const pathname = props?.location?.pathname || "";
    const onClick = () => {
        if (props.callback) {
            props.callback();
        } else {
            // TODO: check if the previous page in history is from Aletheia
            props.history.goBack();
        }
    };

    if (pathname !== "/") {
        return (
            <a
                className="back-button"
                style={{
                    fontWeight: "bold",
                    ...props.style
                }}
                onClick={onClick}
            >
                <ArrowLeftOutlined /> {t("common:back_button")}
            </a>
        );
    } else {
        return <></>;
    }
}

export default withTranslation()(BackButton);
