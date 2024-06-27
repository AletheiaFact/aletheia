import { Row } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";

const CreateCTAButton = ({ children }) => {
    const { t } = useTranslation();

    return (
        <Row
            style={{
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                marginBottom: 16,
            }}
        >
            <p>
                <b>{t("personalityCTA:header")}</b>
            </p>
            <p>{children}</p>
            <p>{t("personalityCTA:footer")}</p>
        </Row>
    );
};

export default CreateCTAButton;
