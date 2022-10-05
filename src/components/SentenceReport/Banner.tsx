import { Col } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import Button, { ButtonType } from "../Button";
import BannerStyle from "./Banner.style";

function Banner() {
    const { t } = useTranslation();

    return (
        <BannerStyle>
            <Col className="text">{t("NewCTARegistration:body")}</Col>
            <Col xs={0} sm={0} md={0} lg={20}>
                <Button
                    onClick={() => {
                        window &&
                            window.umami?.trackEvent(
                                "cta-registration-button",
                                "registration"
                            );
                    }}
                    type={ButtonType.blue}
                    target="_blank"
                    rel="noreferrer"
                    href={t("common:registrationLink")}
                    className="cta-registration-button"
                    rounded="true"
                    style={{
                        height: "fit-content",
                    }}
                >
                    <span>{t("CTARegistration:button")}</span>
                </Button>
            </Col>
        </BannerStyle>
    );
}

export default Banner;
