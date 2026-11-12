import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslation } from "next-i18next";
import FilterSection, { toggleGroupSx } from "./FilterSection";
import { ReviewStatus } from "../repositoryFilters";

const STATUSES: { value: ReviewStatus; label: string }[] = [
    { value: "all", label: "repository:reviewStatusAll" },
    { value: "with", label: "repository:reviewStatusWith" },
    { value: "without", label: "repository:reviewStatusWithout" },
];

interface ReviewStatusFilterProps {
    value: ReviewStatus;
    onChange: (reviewStatus: ReviewStatus) => void;
}

const ReviewStatusFilter = ({ value, onChange }: ReviewStatusFilterProps) => {
    const { t } = useTranslation();

    return (
        <FilterSection title={t("repository:reviewStatus")}>
            <ToggleButtonGroup
                exclusive
                size="small"
                value={value}
                // The group always keeps one status selected
                onChange={(_event, status: ReviewStatus | null) =>
                    status && onChange(status)
                }
                sx={toggleGroupSx}
            >
                {STATUSES.map((status) => (
                    <ToggleButton
                        key={status.value}
                        value={status.value}
                        data-cy={`testRepositoryReviewStatus-${status.value}`}
                    >
                        {t(status.label)}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </FilterSection>
    );
};

export default ReviewStatusFilter;
