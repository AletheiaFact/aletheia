import React from "react";
import AletheiaButton from "../Button";
import { PlusOutlined } from "@ant-design/icons";
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
                <PlusOutlined /> {t("sources:sourceCreateCTAButton")}
            </AletheiaButton>
        </CreateCTAButton>
    );
};

export default SourceCreateCTA;
