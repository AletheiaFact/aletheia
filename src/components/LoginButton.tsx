import { Col } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import Button from "./Button";

const LoginButton = () => {
    const { t } = useTranslation();

    return (
        <Col
            style={{
                display: "flex",
                justifyContent: "center",
                padding: "0px 0px 15px 0px",
            }}
        >
            <Button href="/login">{t("claimReviewForm:loginButton")}</Button>
        </Col>
    );
};

export default LoginButton;
