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
import styled from "styled-components";

const { Title } = Typography;

const SocialMediaContainer = styled.div`
    background: ${colors.lightGray};
    margin-bottom: 32px;
    padding: 20px 8px;
    display: flex;
    border-radius: 0;
    justify-content: center;
    align-itens: center;

    .social-media-container {
        margin-top: 3px;
        height: 39px;
        margin-left: 32px;
    }

    .social-media-title {
        width: auto;
        text-align: center;
        margin-bottom: 0;
        font-size: 26px;
        line-height: 39px;
        font-weight: 400;
        color: ${colors.blackSecondary};
    }

    .social-media-list {
        margin-bottom: 0;
        padding: 0;
        text-align: center;
        display: grid;
        grid-template-columns: 30px 30px 30px 30px;
        grid-column-gap: 16px;
        list-style-type: none;
    }

    @media (min-width: 1024px) {
        display: grid;
        border-radius: 10px;
        grid-template-columns: 1fr;

        .social-media-container {
            width: 276px;
            height: 39px;
            margin: 0 auto;
            margin-top: 16px;
        }

        .social-media-list {
            justify-content: center;
        }
    }

    @media (max-width: 548px) {
        margin-bottom: 16px;
        border-radius: 0;
        display: grid;
        grid-template-columns: 1fr;

        .social-media-container {
            margin: 0 auto;
            margin-top: 16px;
        }
    }
`
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
        <SocialMediaContainer>
            <Title level={2} className="social-media-title">
                {t("share:title")}
            </Title>
            <nav className="social-media-container">
                <ul className="social-media-list">
                    <li>
                        <FacebookShareButton
                            url={href}
                            quote={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            hashtag={trimPersonality}
                            beforeOnClick={() => {umami?.trackEvent('facebook-share-button', 'share')}}
                        >
                            <FacebookIcon size={33}
                                round
                                bgStyle={{fill: colors.bluePrimary }} 
                            />
                        </FacebookShareButton>
                    </li>
                    <li>
                        <TwitterShareButton
                            url={`\n\n${href}\n\n`}
                            title={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            hashtags={["aletheia", trimPersonality, `${claim !== null ? camelize(claimCamelize) : ''}\n`]}
                            beforeOnClick={() => {umami?.trackEvent('twitter-share-button', 'sharing')}}
                        >
                            <TwitterIcon size={33} 
                                round
                                bgStyle={{fill: colors.bluePrimary }} 
                            />
                        </TwitterShareButton>
                    </li>
                    <li>
                        <WhatsappShareButton
                            url={href}
                            title={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            beforeOnClick={() => {umami?.trackEvent('whatsapp-share-button', 'sharing')}}
                        >
                            <WhatsappIcon size={33} 
                                round
                                bgStyle={{fill: colors.bluePrimary }} 
                            />
                        </WhatsappShareButton>
                    </li>
                    <li>
                        <TelegramShareButton
                            url={href}
                            title={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            beforeOnClick={() => {umami?.trackEvent('telegram-share-button', 'sharing')}}
                        >
                            <TelegramIcon size={33} 
                                round
                                bgStyle={{fill: colors.bluePrimary }} 
                            />
                        </TelegramShareButton>
                    </li>
                </ul>
            </nav>
        </SocialMediaContainer>
    );
}

export default SocialMediaShare;
