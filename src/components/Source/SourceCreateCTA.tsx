import React from "react";
import AletheiaButton from "../Button";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "next-i18next";
import CreateCTAButton from "../CreateCTAButton";

const SourceCreateCTA = () => {
    const { t } = useTranslation();

    return (
        <CreateCTAButton>
            <AletheiaButton
                href={`./source/create`}
                data-cy="testButtonCreatePersonality"
            >
                <AddIcon /> {t("sources:sourceCreateCTAButton")}
            </AletheiaButton>
        </CreateCTAButton>
    );
};

export default SourceCreateCTA;
