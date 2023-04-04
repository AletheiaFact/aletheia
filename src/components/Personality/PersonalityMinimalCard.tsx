import { Col } from "antd";
import Title from "antd/lib/typography/Title";
import { useTranslation } from "next-i18next";
import React from "react";
import AletheiaAvatar from "../AletheiaAvatar";
import PersonalityMinimalCardStyle from "./PersonalityMinimalCard.style";

const PersonalityMinimalCard = ({ personality }) => {
    const { t } = useTranslation();
    return (
        <PersonalityMinimalCardStyle
            className="personality-card"
            justify="center"
        >
            <Col>
                <AletheiaAvatar
                    size={117}
                    src={personality.avatar}
                    alt={t("seo:personalityImageAlt", {
                        name: personality.name,
                    })}
                />
            </Col>
            <Col className="personality">
                <Title level={2} className="personality-name">
                    {personality.name}
                </Title>
                <p className="personality-description-content">
                    <span className="personality-description">
                        {personality.description}
                    </span>
                    <a
                        className="personality-profile"
                        href={`/personality/${personality.slug}`}
                    >
                        {t("personality:profile_button")}
                    </a>
                </p>
            </Col>
        </PersonalityMinimalCardStyle>
    );
};

export default PersonalityMinimalCard;
