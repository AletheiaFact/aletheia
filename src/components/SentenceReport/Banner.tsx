import { Col } from "antd";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import { isLoggedIn as isUserLoggedIn } from "../../atoms/currentUser";
import { trackUmamiEvent } from "../../lib/umami";

import Button, { ButtonType } from "../Button";
import BannerStyle from "./Banner.style";

function Banner() {
    const { t } = useTranslation();
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        <BannerStyle>
            <Col className="text">{t("NewCTARegistration:body")}</Col>
            {!isLoggedIn && (
                <Col xs={0} sm={0} md={0} lg={20}>
                    <Button
                        onClick={() => {
                            trackUmamiEvent(
                                "banner-cta-registration-button",
                                "registration"
                            );
                        }}
                        type={ButtonType.blue}
                        href={"/sign-up"}
                        className="cta-registration-button"
                        rounded="true"
                        style={{
                            height: "fit-content",
                        }}
                    >
                        <span>{t("CTARegistration:button")}</span>
                    </Button>
                </Col>
            )}
        </BannerStyle>
    );
}

export default Banner;
