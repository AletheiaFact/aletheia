import React, { useEffect, useState } from "react";
import DonationBannerContent from "./DonationBanner/DonationBannerContent";
import DonationBannerStyle from "./DonationBanner.style";
import { Col } from "antd";
import Cookies from "js-cookie";
import CloseOutlined from "@mui/icons-material/CloseOutlined";

const CloseBanner = ({ onClose }) => {
  return (
    <CloseOutlined
      className="close-banner"
      onClick={() => {
        onClose();
        Cookies.set("cta_donation_banner_show", "false");
      }}
    />
  );
};

const DonationBanner = () => {
  const enableDonationBanner = process.env.NEXT_PUBLIC_ENABLE_BANNER_DONATION === "true";
  const [showDonationBanner, setDonationBanner] = useState<boolean>(true);

  useEffect(() => {
    const BannerCookies = Cookies.get("cta_donation_banner_show") || true;
    if (BannerCookies === true || BannerCookies === "true") {
      return setDonationBanner(true);
    }
    setDonationBanner(false);
  }, []);

  if (!enableDonationBanner) {
    return null
  };

  return showDonationBanner && (
    <DonationBannerStyle>
      <Col className="banner-container">
        <CloseBanner onClose={() => setDonationBanner(false)} />
        <DonationBannerContent />
      </Col>
    </DonationBannerStyle>
  )
};

export default DonationBanner;
