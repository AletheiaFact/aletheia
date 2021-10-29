import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const PersonalityCreateCTA = ({ href }) => {
    const { t } = useTranslation();

    return (
        <>
            <p>
                <b>{t("personalityCTA:header")}</b>
            </p>

            <p>
                <Button type="primary" href={href || `./create`}>
                    + {t("personalityCTA:button")}
                </Button>
            </p>
            <p>{t("personalityCTA:footer")}</p>
        </>
    );

}

export default PersonalityCreateCTA;
