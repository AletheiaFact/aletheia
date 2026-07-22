import React from "react";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import AddIcon from '@mui/icons-material/Add';
import CreateCTAButton from "../CreateCTAButton";
import { useTranslations } from "next-intl";

const PersonalityCreateCTA = ({ href }) => {
    const tPersonalityCTA = useTranslations("personalityCTA");

    return (
        <CreateCTAButton>
            <AletheiaButton
                type={ButtonType.primary}
                href={href || `./create`}
                data-cy="testButtonCreatePersonality"
                startIcon={<AddIcon />}
            >
                {tPersonalityCTA("button")}
            </AletheiaButton>
        </CreateCTAButton>
    );
};

export default PersonalityCreateCTA;
