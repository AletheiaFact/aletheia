import React from "react";
import { Box, ButtonBase, ToggleButton, ToggleButtonGroup } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "next-i18next";
import { reviewPalette } from "../../../constants/reviewColors";
import colors from "../../../styles/colors";
import {
    METHODOLOGY_IDS,
    MethodologyId,
    classificationMethodologies,
    getMethodology,
    toMethodologyLanguage,
} from "../../../../lib/classification-methodology";
import FilterSection, { toggleGroupSx } from "./FilterSection";
import { toggleValue } from "../repositoryFilters";

interface ClassificationFilterProps {
    methodology: MethodologyId;
    onMethodologyChange: (methodology: MethodologyId) => void;
    value: string[];
    onChange: (classification: string[]) => void;
}

// The methodology switch only changes which labels are listed and how they
// are worded. Every methodology stores the same keys, so a selected label
// stays selected when switching (RNCD's "Evidências insuficientes" is
// Aletheia's "Inverificável").
const ClassificationFilter = ({
    methodology,
    onMethodologyChange,
    value,
    onChange,
}: ClassificationFilterProps) => {
    const { t, i18n } = useTranslation();
    const lang = toMethodologyLanguage(i18n.language);

    return (
        <FilterSection title={t("repository:classification")}>
            <ToggleButtonGroup
                exclusive
                size="small"
                value={methodology}
                // The group always keeps one methodology selected
                onChange={(_event, id: MethodologyId | null) =>
                    id && onMethodologyChange(id)
                }
                aria-label={t("repository:methodology")}
                sx={{ ...toggleGroupSx, mb: 1.5 }}
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

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {getMethodology(methodology).options.map((option) => {
                    const selected = value.includes(option.value);
                    const tones = reviewPalette[option.value];
                    return (
                        <ButtonBase
                            key={option.value}
                            aria-pressed={selected}
                            onClick={() =>
                                onChange(toggleValue(value, option.value))
                            }
                            data-cy={`testRepositoryClassification-${option.value}`}
                            sx={{
                                position: "relative",
                                height: 30,
                                px: 4,
                                borderRadius: 15,
                                border: `1px solid ${tones.text}`,
                                backgroundColor: selected
                                    ? tones.text
                                    : colors.white,
                                color: selected ? colors.white : tones.text,
                                fontSize: 12,
                                fontWeight: 700,
                                letterSpacing: "0.02em",
                                textTransform: "uppercase",
                                "&:hover": {
                                    backgroundColor: selected
                                        ? tones.text
                                        : tones.light,
                                },
                                "&.Mui-focusVisible": {
                                    outline: `2px solid ${tones.text}`,
                                    outlineOffset: 2,
                                },
                            }}
                        >
                            {option.label[lang]}
                            {selected && (
                                <CancelIcon
                                    aria-hidden
                                    sx={{
                                        position: "absolute",
                                        right: 6,
                                        fontSize: 18,
                                    }}
                                />
                            )}
                        </ButtonBase>
                    );
                })}
            </Box>
        </FilterSection>
    );
};

export default ClassificationFilter;
