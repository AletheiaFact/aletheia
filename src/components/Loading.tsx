import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import React from "react";

import colors from "../styles/colors";

const Loading = ({ style = {} }) => {
    const { t } = useTranslation();
    return (
        <div
            style={{
                width: "100%",
                height: "50%",
                display: "grid",
                placeContent: "center",
                ...style,
            }}
        >
            <LoadingOutlined
                spin
                style={{ fontSize: 48, color: colors.bluePrimary }}
            />
            <p style={{ color: colors.bluePrimary, marginTop: "24px" }}>
                {t("common:loading")}
            </p>
        </div>
    );
};

export default Loading;
