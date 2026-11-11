import React from "react";
import { Box } from "@mui/material";
import FilterPanelHeader from "./filters/FilterPanelHeader";
import ClassificationFilter from "./filters/ClassificationFilter";
import PersonalityFilter from "./filters/PersonalityFilter";
import DateFilter from "./filters/DateFilter";
import ContentTypeFilter from "./filters/ContentTypeFilter";
import ReviewStatusFilter from "./filters/ReviewStatusFilter";
import TopicFilter from "./filters/TopicFilter";
import {
    FiltersChangeHandler,
    RepositoryFilters,
    RepositoryTab,
} from "./repositoryFilters";

interface RepositoryFilterPanelProps {
    tab: RepositoryTab;
    filters: RepositoryFilters;
    contentModelCounts: Record<string, number>;
    countsReady: boolean;
    onChange: FiltersChangeHandler;
    onClear: () => void;
    // Phone sheet only
    onClose?: () => void;
}

const RepositoryFilterPanel = ({
    tab,
    filters,
    contentModelCounts,
    countsReady,
    onChange,
    onClear,
    onClose,
}: RepositoryFilterPanelProps) => {
    const isClaims = tab === "claims";

    return (
        <Box data-cy="testRepositoryFilters">
            <FilterPanelHeader onClear={onClear} onClose={onClose} />

            {!isClaims && (
                <ClassificationFilter
                    methodology={filters.methodology}
                    onMethodologyChange={(methodology) =>
                        onChange({ methodology })
                    }
                    value={filters.classification}
                    onChange={(classification) => onChange({ classification })}
                />
            )}

            <PersonalityFilter
                value={filters.personality}
                onChange={(personality) => onChange({ personality })}
            />

            <DateFilter
                tab={tab}
                startDate={filters.startDate}
                endDate={filters.endDate}
                onChange={onChange}
            />

            <ContentTypeFilter
                value={filters.contentModel}
                counts={contentModelCounts}
                countsReady={countsReady}
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
        </Box>
    );
};

export default RepositoryFilterPanel;
