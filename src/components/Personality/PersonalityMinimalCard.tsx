import { Col } from "antd";
import Title from "antd/lib/typography/Title";
import { useTranslation } from "next-i18next";
import React from "react";
import PersonalityMinimalCardStyle from "./PersonalityMinimalCard.style";
import PersonalityCardAvatar from "./PersonalityCardAvatar";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";

const PersonalityMinimalCard = ({ personality }) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    return (
        <PersonalityMinimalCardStyle
            className="personality-card"
            justify="center"
        >
            <Col>
                <PersonalityCardAvatar
                    hoistAvatar={false}
                    personality={personality}
                    header={true}
                    componentStyle={{
                        avatarSize: 117,
                        avatarSpan: 8,
                        hiddenIconSize: 16,
                    }}
                    offset={[-18, 18]}
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
                        href={
                            nameSpace !== NameSpaceEnum.Main
                                ? `/${nameSpace}/personality/${personality.slug}`
                                : `/personality/${personality.slug}`
                        }
                    >
                        {t("personality:profile_button")}
                    </a>
                </p>
            </Col>
        </PersonalityMinimalCardStyle>
    );
};

export default PersonalityMinimalCard;
