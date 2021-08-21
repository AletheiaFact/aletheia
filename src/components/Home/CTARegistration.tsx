import { useTranslation } from "next-i18next";
import React from "react";
import { Button, Typography } from "antd";

function CTARegistration() {
    const { t } = useTranslation();
    return (
        <div
            style={{
                backgroundColor: "#2D77A3",
                textAlign: "center",
                padding: "30px"
            }}
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
                shape="round"
                type="default"
                target="_blank"
                href={t("common:registrationLink")}
                style={{
                    color: "#2D77A3",
                    borderColor: "#FFF",
                }}
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
