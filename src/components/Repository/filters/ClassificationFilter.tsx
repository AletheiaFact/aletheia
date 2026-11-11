import React from "react";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "next-i18next";
import reviewColors from "../../../constants/reviewColors";
import {
    MethodologyId,
    getMethodology,
    toMethodologyLanguage,
} from "../../../../lib/classification-methodology";
import FilterSection from "./FilterSection";
import { toggleValue } from "../repositoryFilters";

interface ClassificationFilterProps {
    methodology: MethodologyId | null;
    value: string[];
    onChange: (classification: string[]) => void;
}

const ClassificationFilter = ({
    methodology,
    value,
    onChange,
}: ClassificationFilterProps) => {
    const { t, i18n } = useTranslation();
    const lang = toMethodologyLanguage(i18n.language);

    return (
        <FilterSection title={t("repository:classification")}>
            {getMethodology(methodology).options.map((option) => (
                <FormControlLabel
                    key={option.value}
                    sx={{ display: "flex", mr: 0 }}
                    control={
                        <Checkbox
                            size="small"
                            data-cy={`testRepositoryClassification-${option.value}`}
                            checked={value.includes(option.value)}
                            onChange={() =>
                                onChange(toggleValue(value, option.value))
                            }
                        />
                    }
                    label={
                        <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor: reviewColors[option.value],
                                }}
                            />
                            {option.label[lang]}
                        </Box>
                    }
                />
            ))}
        </FilterSection>
    );
};

export default ClassificationFilter;
