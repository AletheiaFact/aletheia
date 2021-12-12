import { useTranslation } from "next-i18next";
import React from "react";
import { Typography } from "antd";
import colors from "../../styles/colors";
import Button from "../Button";

function CTARegistration({ style = {} }) {
    const { t } = useTranslation();
    const componentStyle = {
        backgroundColor: colors.bluePrimary,
        textAlign: "center",
        padding: "30px",
        ...style
    }
    return (
        <div
            style={componentStyle}
        >
            <Typography.Title level={3} style={{ color: "#fff" }}>
                {t("CTARegistration:title")}
            </Typography.Title>
            <div
                style={{
                    color: "#fff",
                    fontSize: "14px",
                    textWeight: "600",
                    lineHeight: "21px",
                    marginBottom: "10px"
                }}
            >
                {t("CTARegistration:body")}
            </div>
            <div
                style={{
                    color: "#fff",
                    fontSize: "10px",
                    textWeight: "600",
                    lineHeight: "15px",
                    marginBottom: "17px"
                }}
            >
                {t("CTARegistration:footer")}
            </div>
            <Button
                type="white"
                target="_blank"
                className={"umami--click--registration-button"}
                href={t("common:registrationLink")}
            >
                <b
                    style={{
                        fontSize: "14px"
                    }}
                >
                    {t("CTARegistration:button")}
                </b>
            </Button>
        </div>
    );
}

export default CTARegistration;
