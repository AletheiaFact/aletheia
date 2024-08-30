import React from "react";
import { Col } from "antd";
import { useTranslation } from "next-i18next";

const HomeHeaderTitle = () => {
    const { t } = useTranslation();
    return (
        <Col className="home-header-title">
            <h1>{t("home:title")}</h1>
        </Col>
    );
};

export default HomeHeaderTitle;
