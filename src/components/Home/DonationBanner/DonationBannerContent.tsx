import React from "react";
import DonationBannerButton from "./DonationBannerButton";
import { ButtonType } from "../../Button";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import DonationBannerStyle from "../DonationBanner.style";

function DonationBannerContent() {
    const { t } = useTranslation();
    return (
        <DonationBannerStyle >
            <Col
                className="banner-content"
            >
                <h1>
                    {t("donationBanner:title", {
                        date: new Date().getFullYear(),
                    })}
                </h1>
                <p>
                    {t("donationBanner:paragraph")}
                </p>
                <DonationBannerButton type={ButtonType.blue} />
            </Col>
        </DonationBannerStyle >

    );
}

export default DonationBannerContent;
