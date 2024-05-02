import React from "react";
import { Badge, Popover } from "antd";
import { useTranslation } from "next-i18next";

const PersonalityCardTip = ({ children }) => {
    const { t } = useTranslation();
    return (
        <Popover
            placement="right"
            content={t(
                "As informações dessa personalidade são retiradas da Wikidata"
            )}
            trigger="hover"
        >
            <Badge>{children}</Badge>
        </Popover>
    );
};

export default PersonalityCardTip;
