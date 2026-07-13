import React from "react";
import AletheiaButton from "../AletheiaButton";
import AddIcon from '@mui/icons-material/Add';
import CreateCTAButton from "../CreateCTAButton";
import { useTranslations } from "next-intl";

const SourceCreateCTA = () => {
    const tSources = useTranslations("sources");

    return (
        <CreateCTAButton>
            <AletheiaButton
                href={`./source/create`}
                data-cy="testButtonCreatePersonality"
                startIcon={<AddIcon />}
            >
                {tSources("sourceCreateCTAButton")}
            </AletheiaButton>
        </CreateCTAButton>
    );
};

export default SourceCreateCTA;
