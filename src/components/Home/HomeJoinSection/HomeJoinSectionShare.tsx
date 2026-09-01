import React from "react";
import { Box, Typography } from "@mui/material";
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
import { useAtom } from "jotai";
import colors from "../../../styles/colors";
import { trackUmamiEvent } from "../../../lib/umami";
import { currentNameSpace } from "../../../atoms/namespace";
import { NameSpaceEnum } from "../../../types/Namespace";

type HomeJoinSectionShareProps = {
    href: string;
};

const HomeJoinSectionShare = ({ href }: HomeJoinSectionShareProps) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const quote = t("share:quote");
    const trimPersonality = quote.replace(" ", "");
    const iconColor =
        nameSpace === NameSpaceEnum.Main ? colors.primary : colors.secondary;
    const shareTitle = `Veja o discurso de ${quote} na AletheiaFact.org`;

    return (
        <Box className="home-join-share-band">
            <Typography
                variant="h3"
                component="h3"
                className="home-join-share-title"
            >
                {t("share:title")}
            </Typography>
            <Box component="ul" className="home-join-share-list">
                <Box component="li">
                    <FacebookShareButton
                        url={href}
                        quote={shareTitle}
                        hashtag={trimPersonality}
                        beforeOnClick={() =>
                            trackUmamiEvent("Facebook-share-button", "Sharing")
                        }
                    >
                        <FacebookIcon
                            size={44}
                            round
                            bgStyle={{ fill: iconColor }}
                        />
                    </FacebookShareButton>
                </Box>
                <Box component="li">
                    <TwitterShareButton
                        url={`\n\n${href}\n\n`}
                        title={shareTitle}
                        hashtags={["aletheia", trimPersonality]}
                        beforeOnClick={() =>
                            trackUmamiEvent("Twitter-share-button", "Sharing")
                        }
                    >
                        <TwitterIcon
                            size={44}
                            round
                            bgStyle={{ fill: iconColor }}
                        />
                    </TwitterShareButton>
                </Box>
                <Box component="li">
                    <WhatsappShareButton
                        url={href}
                        title={shareTitle}
                        beforeOnClick={() =>
                            trackUmamiEvent("Whatsapp-share-button", "Sharing")
                        }
                    >
                        <WhatsappIcon
                            size={44}
                            round
                            bgStyle={{ fill: iconColor }}
                        />
                    </WhatsappShareButton>
                </Box>
                <Box component="li">
                    <TelegramShareButton
                        url={href}
                        title={shareTitle}
                        beforeOnClick={() =>
                            trackUmamiEvent("Telegram-share-button", "Sharing")
                        }
                    >
                        <TelegramIcon
                            size={44}
                            round
                            bgStyle={{ fill: iconColor }}
                        />
                    </TelegramShareButton>
                </Box>
            </Box>
        </Box>
    );
};

export default HomeJoinSectionShare;
