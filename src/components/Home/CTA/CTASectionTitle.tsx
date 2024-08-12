import { Col } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { isUserLoggedIn } from "../../../atoms/currentUser";
import { useAtom } from "jotai";
import localConfig from "../../../../config/localConfig";

const CTASectionTitle = () => {
    const { t } = useTranslation();
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        <Col md={11} sm={isLoggedIn ? 24 : 13} xs={24} className="footer-text">
            <p className="CTA-title">{localConfig.home.header.message ? localConfig.home.header.message : t("home:statsFooter")}</p>
        </Col>
    );
};

export default CTASectionTitle;
