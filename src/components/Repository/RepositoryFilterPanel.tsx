import React from "react";
import { Box } from "@mui/material";
import { useTranslation } from "next-i18next";
import FilterPanelHeader from "./filters/FilterPanelHeader";
import FilterSection from "./filters/FilterSection";
import SortSelect from "./filters/SortSelect";
import PersonalityFilter from "./filters/PersonalityFilter";
import MethodologyFilter from "./filters/MethodologyFilter";
import ClassificationFilter from "./filters/ClassificationFilter";
import ContentTypeFilter from "./filters/ContentTypeFilter";
import ReviewStatusFilter from "./filters/ReviewStatusFilter";
import TopicFilter from "./filters/TopicFilter";
import DateFilter from "./filters/DateFilter";
import {
    FiltersChangeHandler,
    RepositoryFilters,
    RepositoryTab,
} from "./repositoryFilters";

interface RepositoryFilterPanelProps {
    tab: RepositoryTab;
    filters: RepositoryFilters;
    contentModelCounts: Record<string, number>;
    onChange: FiltersChangeHandler;
    onClear: () => void;
    // Phone sheet only: the sort moves into the panel and it can be closed
    showSort?: boolean;
    onClose?: () => void;
}

const RepositoryFilterPanel = ({
    tab,
    filters,
    contentModelCounts,
    onChange,
    onClear,
    showSort = false,
    onClose,
}: RepositoryFilterPanelProps) => {
    const { t } = useTranslation();
    const isClaims = tab === "claims";

    return (
        <Box data-cy="testRepositoryFilters">
            <FilterPanelHeader onClear={onClear} onClose={onClose} />

            {showSort && (
                <FilterSection title={t("repository:sortBy")}>
                    <SortSelect
                        fullWidth
                        value={filters.order}
                        onChange={(order) => onChange({ order })}
                        inputProps={{ "aria-label": t("repository:sortBy") }}
                    />
                </FilterSection>
            )}

            <PersonalityFilter
                value={filters.personality}
                onChange={(personality) => onChange({ personality })}
            />

            {!isClaims && (
                <>
                    <MethodologyFilter
                        value={filters.methodology}
                        classification={filters.classification}
                        onChange={onChange}
                    />
                    <ClassificationFilter
                        methodology={filters.methodology}
                        value={filters.classification}
                        onChange={(classification) =>
                            onChange({ classification })
                        }
                    />
                </>
            )}

            <ContentTypeFilter
                value={filters.contentModel}
                counts={contentModelCounts}
                onChange={(contentModel) => onChange({ contentModel })}
            />

            {isClaims && (
                <ReviewStatusFilter
                    value={filters.reviewStatus}
                    onChange={(reviewStatus) => onChange({ reviewStatus })}
                />
            )}

            <TopicFilter
                value={filters.topic}
                onChange={(topic) => onChange({ topic })}
            />

            <DateFilter
                tab={tab}
                startDate={filters.startDate}
                endDate={filters.endDate}
                onChange={onChange}
            />
        </Box>
    );
};

export default RepositoryFilterPanel;
