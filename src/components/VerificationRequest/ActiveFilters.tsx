import React from "react";
import { Grid, Typography, Chip } from "@mui/material";
import { ActionTypes } from "../../store/types";

enum FilterType {
    TOPIC = "topic",
    IMPACT_AREA = "impactArea",
}

interface TopicOption {
    name: string;
    matchedAlias?: string | null;
}

interface FilterState {
    topicFilterUsed: string[];
    impactAreaFilterUsed: string[];
    autoCompleteTopicsResults?: TopicOption[];
}

interface FilterActions {
    dispatch: (action: { type: ActionTypes; [key: string]: any }) => void;
    t: (key: string) => string;
    setPaginationModel: React.Dispatch<
        React.SetStateAction<{ page: number; pageSize: number }>
    >;
    setApplyFilters: (value: boolean) => void;
}

interface ActiveFiltersProps {
    state: FilterState;
    actions: FilterActions;
}

interface FilterItem {
    label: string;
    value: string;
    type: FilterType;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ state, actions }) => {
    const { topicFilterUsed, impactAreaFilterUsed, autoCompleteTopicsResults } =
        state;
    const { dispatch, t, setPaginationModel, setApplyFilters } = actions;

    const getTopicDisplayLabel = (topicName: string): string => {
        const topicWithAlias = autoCompleteTopicsResults?.find(
            (topic) => topic.name === topicName
        );
        if (topicWithAlias?.matchedAlias) {
            return `${topicName} (${topicWithAlias.matchedAlias})`;
        }
        return topicName;
    };

    const handleRemoveFilter = (removedFilter: FilterItem): void => {
        if (removedFilter.type === FilterType.TOPIC) {
            const updatedTopics = topicFilterUsed.filter(
                (topic) => topic !== removedFilter.value
            );
            dispatch({
                type: ActionTypes.SET_TOPIC_FILTER_USED,
                topicFilterUsed: updatedTopics,
            });
        } else if (removedFilter.type === FilterType.IMPACT_AREA) {
            const updatedImpactAreas = impactAreaFilterUsed.filter(
                (impactArea) => impactArea !== removedFilter.value
            );
            dispatch({
                type: ActionTypes.SET_IMPACT_AREA_FILTER_USED,
                impactAreaFilterUsed: updatedImpactAreas,
            });
        }
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        setApplyFilters(true);
    };

    const ChipComponent = (type: FilterType, value: string): JSX.Element => {
        const label =
            type === FilterType.TOPIC
                ? `${t(
                      "verificationRequest:topicFilterLabel"
                  )} ${getTopicDisplayLabel(value)}`
                : `${t("verificationRequest:impactAreaFilterLabel")} ${value}`;

        const deleteObject: FilterItem = {
            label:
                type === FilterType.TOPIC
                    ? `Topic: ${value}`
                    : `Impact Area: ${value}`,
            value: value,
            type: type,
        };

        return (
            <Grid item key={value}>
                <Chip
                    label={label}
                    onDelete={() => handleRemoveFilter(deleteObject)}
                />
            </Grid>
        );
    };

    return (
        (topicFilterUsed.length > 0 || impactAreaFilterUsed.length > 0) && (
            <Grid item xs={10}>
                <Typography variant="subtitle1" gutterBottom>
                    {t("verificationRequest:activeFiltersLabel")}
                </Typography>
                <Grid container spacing={1}>
                    {topicFilterUsed?.map((topic) =>
                        ChipComponent(FilterType.TOPIC, topic)
                    )}
                    {impactAreaFilterUsed?.map((impactArea) =>
                        ChipComponent(FilterType.IMPACT_AREA, impactArea)
                    )}
                </Grid>
            </Grid>
        )
    );
};

export default ActiveFilters;
