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

const SocialMediaShare = ({ quote = null, href = '', claim = null }) => {
    const { t } = useTranslation();
    quote = quote || t("share:quote");

    const trimPersonality = quote.replace(" ", ""); 

    let claimCamelize
    if(claim !== null) {
        claimCamelize = claim
            .split(",").join("")
            .split(".").join("")
    }        
    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }
    
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
                            quote={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            hashtag={trimPersonality}
                            beforeOnClick={() => {umami?.trackEvent('facebook-share-button', 'share')}}
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                    </li>
                    <li>
                        <TwitterShareButton
                            url={`\n\n${href}\n\n`}
                            title={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            hashtags={["aletheia", trimPersonality, `${claim !== null ? camelize(claimCamelize) : ''}\n`]}
                            beforeOnClick={() => {umami?.trackEvent('twitter-share-button', 'sharing')}}
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </li>
                    <li>
                        <WhatsappShareButton
                            url={href}
                            title={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            beforeOnClick={() => {umami?.trackEvent('whatsapp-share-button', 'sharing')}}
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                    </li>
                    <li>
                        <TelegramShareButton
                            url={href}
                            title={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            beforeOnClick={() => {umami?.trackEvent('telegram-share-button', 'sharing')}}
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
