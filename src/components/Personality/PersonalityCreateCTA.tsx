import React from "react";
import { useTranslation } from "next-i18next";
import Button, { ButtonType } from "../Button";
import { PlusOutlined } from "@ant-design/icons";

const PersonalityCreateCTA = ({ href }) => {
    const { t } = useTranslation();

    return (
        <>
            <p>
                <b>{t("personalityCTA:header")}</b>
            </p>

            <p>
                <Button type={ButtonType.blue} href={href || `./create`}>
                    <PlusOutlined /> {t("personalityCTA:button")}
                </Button>
            </p>
            <p>{t("personalityCTA:footer")}</p>
        </>
    );

}

export default PersonalityCreateCTA;
