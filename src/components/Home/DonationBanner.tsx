import React, { useState } from "react";
import DonationBannerContent from "./DonationBanner/DonationBannerContent";
import DonationBannerStyle from "./DonationBanner.style";
import { Col } from "antd";
import { useTranslation } from "next-i18next";

const DonationBanner = () => {
  const { t } = useTranslation();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const handleToggleBanner = () => {
    setIsBannerVisible((prev) => !prev);
  }

  return (
    <DonationBannerStyle>
      <Col className="banner-container">
        {isBannerVisible && <DonationBannerContent />}
        <button
          className="show-banner"
          onClick={handleToggleBanner}>
          {isBannerVisible ? t("donationBanner:hideButton") : t("donationBanner:showButton")}
        </button>
      </Col>
    </DonationBannerStyle >
  );
};

export default DonationBanner;
