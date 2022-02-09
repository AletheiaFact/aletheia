import React from "react";
import { Row } from "antd";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    TelegramShareButton,
    TelegramIcon
} from "react-share";
import { useTranslation } from "next-i18next";
import colors from "../styles/colors";

const SocialMediaShare = ({ quote = null, href = '' }) => {
    const { t } = useTranslation();
    quote = quote || t("share:quote");
    return (
        <Row
            style={{
                background: colors.grayTertiary,
                borderRadius: "30px",
                margin: "45px 15px",
                padding: "20px 0px"
            }}
        >
            <div
                style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: "26px",
                    lineHeight: "39px",
                    color: colors.bluePrimary
                }}
            >
                {t("share:title")}
            </div>
            <div
                style={{
                    width: "100%",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-evenly",
                    padding: "0px 20%",
                    marginTop: "15px"
                }}
            >
                <FacebookShareButton
                    url={href}
                    quote={quote}
                >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                    url={href}
                    title={quote}
                >
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton
                    url={href}
                    title={quote}
                >
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <TelegramShareButton
                    url={href}
                    title={quote}
                >
                    <TelegramIcon size={32} round />
                </TelegramShareButton>
            </div>
        </Row>
    );
}

export default SocialMediaShare;
