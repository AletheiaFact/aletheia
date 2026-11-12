import React from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";
import FilterSection from "./FilterSection";
import { CONTENT_MODELS, toggleValue } from "../repositoryFilters";

interface ContentTypeFilterProps {
    value: string[];
    counts: Record<string, number>;
    // False while the results reload, when the counts are stale
    countsReady: boolean;
    onChange: (contentModel: string[]) => void;
}

const ContentTypeFilter = ({
    value,
    counts,
    countsReady,
    onChange,
}: ContentTypeFilterProps) => {
    const { t } = useTranslation();

    return (
        <FilterSection title={t("repository:contentType")}>
            {CONTENT_MODELS.map((contentModel) => {
                const count = counts[contentModel] || 0;
                const checked = value.includes(contentModel);
                // Nothing to find under it with the other filters; a
                // checked one stays enabled so it can be unchecked
                const disabled = countsReady && count === 0 && !checked;
                return (
                    <FormControlLabel
                        key={contentModel}
                        disabled={disabled}
                        sx={{
                            display: "flex",
                            mr: 0,
                            "& .MuiFormControlLabel-label": { flex: 1 },
                        }}
                        control={
                            <Checkbox
                                size="small"
                                data-cy={`testRepositoryContentModel-${contentModel}`}
                                checked={checked}
                                onChange={() =>
                                    onChange(toggleValue(value, contentModel))
                                }
                            />
                        }
                        label={
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                {t(`repository:contentModel.${contentModel}`)}
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ color: colors.neutralSecondary }}
                                >
                                    {count}
                                </Typography>
                            </Box>
                        }
                    />
                );
            })}
        </FilterSection>
    );
};

export default ContentTypeFilter;
