import React from "react";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import localConfig from "../../../../config/localConfig";

const HomeHeaderTitle = () => {
    const { t } = useTranslation();
    return (
        <Col className="home-header-title">
            <h1>{localConfig.home.header.title ? localConfig.home.header.title : t("home:title")}</h1>
        </Col>
    );
};

export default HomeHeaderTitle;
