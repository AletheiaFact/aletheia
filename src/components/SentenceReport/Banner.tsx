import { Col } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { trackUmamiEvent } from "../../lib/umami";

import Button, { ButtonType } from "../Button";
import BannerStyle from "./Banner.style";
import AletheiaVideo from "../AletheiaVideo";

function Banner() {
    const { t } = useTranslation();

    return (
        <BannerStyle>
            <Col className="video-container">
                <AletheiaVideo />
            </Col>
            <Col span={20}>
                <Button
                    onClick={() => {
                        trackUmamiEvent(
                            "banner-cta-registration-button",
                            "registration"
                        );
                    }}
                    type={ButtonType.whiteBlack}
                    href={"/sign-up"}
                    className="cta-registration-button"
                    style={{
                        height: "fit-content",
                        borderRadius: "10px",
                    }}
                >
                    <span>{t("CTARegistration:button")}</span>
                </Button>
            </Col>
        </BannerStyle>
    );
}

export default Banner;
