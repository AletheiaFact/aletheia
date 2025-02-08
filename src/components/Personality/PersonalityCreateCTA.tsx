import React from "react";
import { useTranslation } from "next-i18next";
import Button, { ButtonType } from "../Button";
import AddIcon from '@mui/icons-material/Add';
import CreateCTAButton from "../CreateCTAButton";

const PersonalityCreateCTA = ({ href }) => {
    const { t } = useTranslation();

    return (
        <CreateCTAButton>
            <Button
                type={ButtonType.blue}
                href={href || `./create`}
                data-cy="testButtonCreatePersonality"
            >
                <AddIcon /> {t("personalityCTA:button")}
            </Button>
        </CreateCTAButton>
    );
};

export default PersonalityCreateCTA;
