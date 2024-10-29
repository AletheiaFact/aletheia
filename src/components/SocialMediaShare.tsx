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
    TelegramIcon,
} from "react-share";
import { useTranslation } from "next-i18next";
import colors from "../styles/colors";
import SocialMediaShareStyle from "./SocialMediaShare.style";
import { trackUmamiEvent } from "../lib/umami";
import { useAtom } from "jotai";
import { isUserLoggedIn } from "../atoms/currentUser";
import { NameSpaceEnum } from "../types/Namespace";
import { currentNameSpace } from "../atoms/namespace";

const { Title } = Typography;

const SocialMediaShare = ({ quote = null, href = "", claim = null }) => {
    const { t } = useTranslation();
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [nameSpace] = useAtom(currentNameSpace);

    quote = quote || t("share:quote");

    const trimPersonality = quote.replace(" ", "");

    let claimCamelize;
    if (claim !== null) {
        claimCamelize = claim.split(",").join("").split(".").join("");
    }
    function camelize(str) {
        return str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/\s+/g, "");
    }

    return (
        <SocialMediaShareStyle
            className={!isLoggedIn && "logged-out"}
            style={{
                background: colors.lightNeutral,
                padding: "20px 8px",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
            }}
        >
            <Title
                level={3}
                style={{
                    width: "auto",
                    textAlign: "center",
                    marginBottom: 0,
                    fontSize: "26px",
                    lineHeight: "39px",
                    fontWeight: 400,
                    color: colors.blackSecondary,
                }}
            >
                {t("share:title")}
            </Title>
            <nav className="social-media-container">
                <ul
                    className="social-media-list"
                    style={{
                        marginBottom: 0,
                        padding: 0,
                        textAlign: "center",
                        display: "grid",
                        gridTemplateColumns: "30px 30px 30px 30px",
                        gridColumnGap: "16px",
                        listStyleType: "none",
                    }}
                >
                    <li>
                        <FacebookShareButton
                            url={href}
                            quote={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            hashtag={trimPersonality}
                            beforeOnClick={() => {
                                trackUmamiEvent(
                                    "Facebook-share-button",
                                    "Sharing"
                                );
                            }}
                        >
                            <FacebookIcon
                                size={33}
                                round
                                bgStyle={{
                                    fill:
                                        nameSpace === NameSpaceEnum.Main
                                            ? colors.primary
                                            : colors.secondary,
                                }}
                            />
                        </FacebookShareButton>
                    </li>
                    <li>
                        <TwitterShareButton
                            url={`\n\n${href}\n\n`}
                            title={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            hashtags={[
                                "aletheia",
                                trimPersonality,
                                `${
                                    claim !== null
                                        ? camelize(claimCamelize)
                                        : ""
                                }\n`,
                            ]}
                            beforeOnClick={() => {
                                trackUmamiEvent(
                                    "Twitter-share-button",
                                    "Sharing"
                                );
                            }}
                        >
                            <TwitterIcon
                                size={33}
                                round
                                bgStyle={{
                                    fill:
                                        nameSpace === NameSpaceEnum.Main
                                            ? colors.primary
                                            : colors.secondary,
                                }}
                            />
                        </TwitterShareButton>
                    </li>
                    <li>
                        <WhatsappShareButton
                            url={href}
                            title={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            beforeOnClick={() => {
                                trackUmamiEvent(
                                    "Whatsapp-share-button",
                                    "Sharing"
                                );
                            }}
                        >
                            <WhatsappIcon
                                size={33}
                                round
                                bgStyle={{
                                    fill:
                                        nameSpace === NameSpaceEnum.Main
                                            ? colors.primary
                                            : colors.secondary,
                                }}
                            />
                        </WhatsappShareButton>
                    </li>
                    <li>
                        <TelegramShareButton
                            url={href}
                            title={`Veja o discurso de ${quote} na AletheiaFact.org`}
                            beforeOnClick={() => {
                                trackUmamiEvent(
                                    "Telegram-share-button",
                                    "Sharing"
                                );
                            }}
                        >
                            <TelegramIcon
                                size={33}
                                round
                                bgStyle={{
                                    fill:
                                        nameSpace === NameSpaceEnum.Main
                                            ? colors.primary
                                            : colors.secondary,
                                }}
                            />
                        </TelegramShareButton>
                    </li>
                </ul>
            </nav>
        </SocialMediaShareStyle>
    );
};

export default SocialMediaShare;
