import React from "react";
import { ActionTypes } from "../../store/types";
import { Grid, Button } from "@mui/material";
import FilterToggleButtons from "./FilterToggleButtons";
import FilterBar from "./FilterBar";

const FilterManager = ({ state, actions }) => {
  const {
    priorityFilter,
    sourceChannelFilter,
    topicFilterUsed,
    impactAreaFilterUsed,
    viewMode,
  } = state;
  const {
    setViewMode,
    setPriorityFilter,
    setSourceChannelFilter,
    setFilterValue,
    setApplyFilters,
    createFilterChangeHandler,
    dispatch,
    t,
  } = actions;

  const handleResetFilters = () => {
    setFilterValue([]);
    setPriorityFilter("all");
    setSourceChannelFilter("all");
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
      xs={10}
      container
      alignItems="center"
      justifyContent="space-between"
      style={{ marginTop: 30 }}
    >
      <Grid item sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FilterToggleButtons viewMode={viewMode} setViewMode={setViewMode} />
        {viewMode === "board" && (
          <FilterBar
            state={state}
            actions={actions}
            priorityFilter={priorityFilter}
            sourceChannelFilter={sourceChannelFilter}
            setPriorityFilter={setPriorityFilter}
            setSourceChannelFilter={setSourceChannelFilter}
            createFilterChangeHandler={createFilterChangeHandler}
          />
        )}
      </Grid>
      {viewMode === "board" &&
        (topicFilterUsed.length > 0 ||
          priorityFilter !== "all" ||
          sourceChannelFilter !== "all" ||
          impactAreaFilterUsed.length > 0) && (
          <Button onClick={handleResetFilters}>
            {t("verificationRequest:resetFiltersButton")}
          </Button>
        )}
    </Grid>
  );
};

export default FilterManager;
