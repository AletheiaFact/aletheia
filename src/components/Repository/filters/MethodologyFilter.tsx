import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslation } from "next-i18next";
import {
    METHODOLOGY_IDS,
    MethodologyId,
    classificationMethodologies,
    isAllowedClassification,
    toMethodologyLanguage,
} from "../../../../lib/classification-methodology";
import FilterSection, { toggleGroupSx } from "./FilterSection";
import { FiltersChangeHandler } from "../repositoryFilters";

interface MethodologyFilterProps {
    value: MethodologyId | null;
    classification: string[];
    onChange: FiltersChangeHandler;
}

const MethodologyFilter = ({
    value,
    classification,
    onChange,
}: MethodologyFilterProps) => {
    const { t, i18n } = useTranslation();
    const lang = toMethodologyLanguage(i18n.language);

    const handleChange = (methodology: MethodologyId | null) =>
        onChange({
            methodology,
            // Keep only the labels the new methodology offers
            classification: methodology
                ? classification.filter((key) =>
                      isAllowedClassification(methodology, key)
                  )
                : classification,
        });

    return (
        <FilterSection title={t("repository:methodology")}>
            <ToggleButtonGroup
                exclusive
                size="small"
                value={value}
                onChange={(_event, methodology) => handleChange(methodology)}
                sx={toggleGroupSx}
            >
                {METHODOLOGY_IDS.map((id) => (
                    <ToggleButton
                        key={id}
                        value={id}
                        data-cy={`testRepositoryMethodology-${id}`}
                    >
                        {classificationMethodologies[id].name[lang]}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </FilterSection>
    );
};

export default MethodologyFilter;
