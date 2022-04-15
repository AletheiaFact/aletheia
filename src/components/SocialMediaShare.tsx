import React from "react";
import { Typography } from "antd";
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

const { Title } = Typography;

const SocialMediaShare = ({ quote = null, href = '' }) => {
    const { t } = useTranslation();
    quote = quote || t("share:quote");
    return (
        <section
            style={{
                background: colors.grayTertiary,
                borderRadius: "30px",
                margin: "45px 15px",
                padding: "20px 0px"
            }}
        >
            <Title
                level={2}
                style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: "26px",
                    lineHeight: "39px",
                    fontWeight: 400,
                    color: colors.bluePrimary
                }}
            >
                {t("share:title")}
            </Title>
            <nav
                style={{
                    marginTop: "15px",
                    width: "100%",
                }}
            >
                <ul 
                    style={{
                        marginBottom: 0,
                        textAlign: "center",
                        display: "flex",
                        padding: "0px 20%",
                        justifyContent: "space-evenly",
                        listStyleType: "none"
                    }}
                >
                    <li>
                        <FacebookShareButton
                            url={href}
                            quote={quote}
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                    </li>
                    <li>
                        <TwitterShareButton
                            url={href}
                            title={quote}
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </li>
                    <li>
                        <WhatsappShareButton
                            url={href}
                            title={quote}
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                    </li>
                    <li>
                        <TelegramShareButton
                            url={href}
                            title={quote}
                        >
                            <TelegramIcon size={32} round />
                        </TelegramShareButton>
                    </li>
                </ul>
            </nav>
        </section>
    );
}

export default SocialMediaShare;
