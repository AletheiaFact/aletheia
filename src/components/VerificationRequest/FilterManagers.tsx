import React from "react";
import { ActionTypes } from "../../store/types";
import { Grid } from "@mui/material";
import FilterToggleButtons from "../FilterToggleButtons";
import FilterBar from "./FilterBar";
import AletheiaButton, { ButtonType } from "../Button";
import FilterPopover from "./FilterPopover";
import { ViewList, ViewModule } from "@mui/icons-material";

const FilterManager = ({ state, actions }) => {
    const {
        priorityFilter,
        sourceChannelFilter,
        topicFilterUsed,
        impactAreaFilterUsed,
        viewMode,
        startDate,
        endDate,
    } = state;
    const {
        setViewMode,
        setPriorityFilter,
        setSourceChannelFilter,
        setFilterValue,
        setApplyFilters,
        dispatch,
        t,
        setStartDate,
        setEndDate,
    } = actions;

    const isBoard = viewMode === "left"

    const handleResetFilters = () => {
        setFilterValue([]);
        setPriorityFilter("all");
        setSourceChannelFilter("all");
        setStartDate(null);
        setEndDate(null);
        dispatch({
            type: ActionTypes.SET_TOPIC_FILTER_USED,
            topicFilterUsed: [],
        });
        dispatch({
            type: ActionTypes.SET_IMPACT_AREA_FILTER_USED,
            impactAreaFilterUsed: [],
        });
        setApplyFilters(true);
    };

    return (
        <Grid
            item
            className="filterActions"
        >
            <Grid className="filterToggleContainer">
                <FilterToggleButtons
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    leftOption={<ViewModule />}
                    rightOption={<ViewList />}
                />
                {isBoard && <FilterPopover state={state} actions={actions} />}
            </Grid>

            <Grid className="filterBarContainer">
                {isBoard && (
                    <FilterBar
                        state={state}
                        actions={actions}
                    />
                )}

                {isBoard &&
                    (topicFilterUsed.length > 0 ||
                        priorityFilter !== "all" ||
                        sourceChannelFilter !== "all" ||
                        impactAreaFilterUsed.length > 0 ||
                        startDate ||
                        endDate) && (
                        <AletheiaButton
                            type={ButtonType.whiteBlack}
                            onClick={handleResetFilters}>
                            {t("verificationRequest:resetFiltersButton")}
                        </AletheiaButton>
                    )}
            </Grid>
        </Grid >
    );
};
export default FilterManager;
