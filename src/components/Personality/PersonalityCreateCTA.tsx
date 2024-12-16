import React from "react";
import { useTranslation } from "next-i18next";
import Button, { ButtonType } from "../Button";
import { PlusOutlined } from "@ant-design/icons";
import CreateCTAButton from "../CreateCTAButton";

const PersonalityCreateCTA = ({ href }) => {
    const { t } = useTranslation();

    return (
        <CreateCTAButton>
            <Button
                buttonType={ButtonType.blue}
                href={href || `./create`}
                data-cy="testButtonCreatePersonality"
            >
                <PlusOutlined /> {t("personalityCTA:button")}
            </Button>
        </CreateCTAButton>
    );
};

export default PersonalityCreateCTA;
