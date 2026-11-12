import React from "react";
import { Box, Button, Chip } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { TFunction, useTranslation } from "next-i18next";
import { reviewPalette } from "../../constants/reviewColors";
import colors from "../../styles/colors";
import { formatDateRange } from "../../utils/dateRangeFormat";
import { getClassificationLabel } from "../../../lib/classification-methodology";
import {
    FiltersChangeHandler,
    RepositoryFilters,
    RepositoryTab,
} from "./repositoryFilters";

interface ActiveFilter {
    key: string;
    label: string;
    // Classification chips take the colour of their verdict
    color?: string;
    remove: Partial<RepositoryFilters>;
}

// One entry per applied filter of the open tab; the search text is left
// out, since it stays visible in its own field.
export const getActiveFilters = (
    tab: RepositoryTab,
    filters: RepositoryFilters,
    language: string,
    t: TFunction
): ActiveFilter[] => {
    const active: ActiveFilter[] = [];

    if (tab === "reviews") {
        filters.classification.forEach((key) =>
            active.push({
                key: `classification-${key}`,
                label:
                    getClassificationLabel(filters.methodology, key, language) ??
                    key,
                color: reviewPalette[key]?.text,
                remove: {
                    classification: filters.classification.filter(
                        (value) => value !== key
                    ),
                },
            })
        );
    }
    if (filters.personality) {
        active.push({
            key: "personality",
            label: filters.personality.name,
            remove: { personality: null },
        });
    }
    if (filters.startDate || filters.endDate) {
        active.push({
            key: "date",
            label: formatDateRange(
                filters.startDate,
                filters.endDate,
                language,
                t,
                { compactMonth: true }
            ),
            remove: { startDate: null, endDate: null },
        });
    }
    filters.contentModel.forEach((contentModel) =>
        active.push({
            key: `contentModel-${contentModel}`,
            label: t(`repository:contentModel.${contentModel}`),
            remove: {
                contentModel: filters.contentModel.filter(
                    (value) => value !== contentModel
                ),
            },
        })
    );
    if (tab === "claims" && filters.reviewStatus !== "all") {
        active.push({
            key: "reviewStatus",
            label: `${t("repository:reviewStatus")}: ${t(
                filters.reviewStatus === "with"
                    ? "repository:reviewStatusWith"
                    : "repository:reviewStatusWithout"
            )}`,
            remove: { reviewStatus: "all" },
        });
    }
    if (filters.topic) {
        active.push({
            key: "topic",
            label: filters.topic.name,
            remove: { topic: null },
        });
    }
    return active;
};

interface ActiveFilterChipsProps {
    filters: ActiveFilter[];
    onChange: FiltersChangeHandler;
    onClear: () => void;
}

const ActiveFilterChips = ({
    filters,
    onChange,
    onClear,
}: ActiveFilterChipsProps) => {
    const { t } = useTranslation();

    if (!filters.length) return null;

    return (
        <Box
            role="region"
            aria-label={t("repository:activeFilters")}
            sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
            }}
            data-cy="testRepositoryActiveFilters"
        >
            {filters.map((filter) => (
                <Chip
                    key={filter.key}
                    label={filter.label}
                    size="small"
                    onDelete={() => onChange(filter.remove)}
                    deleteIcon={
                        <CancelIcon
                            aria-label={t("repository:removeFilter", {
                                label: filter.label,
                            })}
                        />
                    }
                    data-cy={`testRepositoryActiveFilter-${filter.key}`}
                    sx={
                        filter.color
                            ? {
                                  height: 28,
                                  backgroundColor: filter.color,
                                  color: colors.white,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  "& .MuiChip-deleteIcon": {
                                      color: colors.white,
                                      "&:hover": { color: colors.white },
                                  },
                              }
                            : {
                                  height: 28,
                                  backgroundColor: colors.white,
                                  border: `1px solid ${colors.neutralTertiary}`,
                                  color: colors.neutral,
                              }
                    }
                />
            ))}
            <Button
                size="small"
                onClick={onClear}
                sx={{
                    ml: "auto",
                    textTransform: "none",
                    color: colors.lightPrimary,
                }}
                data-cy="testRepositoryClearAllFilters"
            >
                {t("repository:clearAllFilters")}
            </Button>
        </Box>
    );
};

export default ActiveFilterChips;
