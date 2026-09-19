import React from "react";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import AddIcon from '@mui/icons-material/Add';
import CreateCTAButton from "../CreateCTAButton";

const PersonalityCreateCTA = ({ href }) => {
    const { t } = useTranslation();

    return (
        <CreateCTAButton>
            <AletheiaButton
                type={ButtonType.primary}
                href={href || `./create`}
                data-cy="testButtonCreatePersonality"
                startIcon={<AddIcon />}
            >
                {t("personalityCTA:button")}
            </AletheiaButton>
        </CreateCTAButton>
    );
};

export default PersonalityCreateCTA;
