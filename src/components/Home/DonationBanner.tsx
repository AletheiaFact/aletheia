import React, { useEffect, useState } from "react";
import DonationBannerContent from "./DonationBanner/DonationBannerContent";
import DonationBannerStyle from "./DonationBanner.style";
import { Col } from "antd";
import Cookies from "js-cookie";
import CloseOutlined from "@mui/icons-material/CloseOutlined";

const closeBanner = (onClose) => {
    onClose();
    Cookies.set("cta_donation_banner_show", "false");
};

const DonationBanner = () => {
    const enableDonationBanner =
        process.env.NEXT_PUBLIC_ENABLE_BANNER_DONATION === "true";
    const [showDonationBanner, setDonationBanner] = useState<boolean>(false);

    useEffect(() => {
        const CloseBannerCookies = Cookies.get("cta_donation_banner_show");
        if (CloseBannerCookies) {
            return setDonationBanner(false);
        }
        setDonationBanner(true);
    }, []);

    if (!enableDonationBanner) {
        return null;
    }

    return (
        showDonationBanner && (
            <DonationBannerStyle>
                <Col className="banner-container">
                    <CloseOutlined
                        className="close-banner"
                        onClick={() =>
                            closeBanner(() => setDonationBanner(false))
                        }
                    />
                    <DonationBannerContent
                        closeClick={() =>
                            closeBanner(() => setDonationBanner(false))
                        }
                    />
                </Col>
            </DonationBannerStyle>
        )
    );
};

export default DonationBanner;
