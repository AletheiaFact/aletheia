import React from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";
import FilterSection from "./FilterSection";
import { CONTENT_MODELS, toggleValue } from "../repositoryFilters";

interface ContentTypeFilterProps {
    value: string[];
    counts: Record<string, number>;
    onChange: (contentModel: string[]) => void;
}

const ContentTypeFilter = ({
    value,
    counts,
    onChange,
}: ContentTypeFilterProps) => {
    const { t } = useTranslation();

    return (
        <FilterSection title={t("repository:contentType")}>
            {CONTENT_MODELS.map((contentModel) => (
                <FormControlLabel
                    key={contentModel}
                    sx={{
                        display: "flex",
                        mr: 0,
                        "& .MuiFormControlLabel-label": { flex: 1 },
                    }}
                    control={
                        <Checkbox
                            size="small"
                            data-cy={`testRepositoryContentModel-${contentModel}`}
                            checked={value.includes(contentModel)}
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
                                {counts[contentModel] || 0}
                            </Typography>
                        </Box>
                    }
                />
            ))}
        </FilterSection>
    );
};

export default ContentTypeFilter;
