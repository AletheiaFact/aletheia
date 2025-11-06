import React from "react";
import { useAppSelector } from "../../store/store";
import { ActionTypes } from "../../store/types";
import SelectFilter from "./SelectFilter";
import FilterPopover from "./FilterPopover";
import {
  Grid,
  IconButton,
  Button,
  FormControl,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import DateRangePicker from "../DateRangePicker";

const FilterManager = ({ state, actions }) => {
  const {
    priorityFilter,
    sourceChannelFilter,
    filterValue,
    filterType,
    anchorEl,
    autoCompleteTopicsResults,
    topicFilterUsed,
    impactAreaFilterUsed,
    startDate,
    endDate
  } = state;
  const {
    setPriorityFilter,
    setSourceChannelFilter,
    setFilterValue,
    setFilterType,
    setAnchorEl,
    setPaginationModel,
    setApplyFilters,
    fetchTopicList,
    createFilterChangeHandler,
    dispatch,
    t,
    setStartDate,
    setEndDate
  } = actions;
  const { vw } = useAppSelector((state) => state);

  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);

  const handleFilterApply = () => {
    setAnchorEl(null);
    if (filterType === "topics" && filterValue) {
      const topicsToAdd = Array.isArray(filterValue)
        ? filterValue
        : [filterValue];
      const updatedTopics = [...new Set([...topicFilterUsed, ...topicsToAdd])];
      dispatch({
        type: ActionTypes.SET_TOPIC_FILTER_USED,
        topicFilterUsed: updatedTopics,
      });
    }
    if (filterType === "impactArea" && filterValue) {
      const impactAreasToAdd = Array.isArray(filterValue)
        ? filterValue
        : [filterValue];
      const updatedImpactAreas = [
        ...new Set([...impactAreaFilterUsed, ...impactAreasToAdd]),
      ];
      dispatch({
        type: ActionTypes.SET_IMPACT_AREA_FILTER_USED,
        impactAreaFilterUsed: updatedImpactAreas,
      });
    }
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setApplyFilters(true);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setApplyFilters(true);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setApplyFilters(true);
  };

  const handleResetFilters = () => {
    setFilterValue([]);
    setPriorityFilter("all");
    setSourceChannelFilter("all");
    setPaginationModel({ pageSize: 20, page: 0 });
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
      xs={10}
      container
      alignItems="center"
      justifyContent="space-between"
      style={{ marginTop: 30 }}
    >
      <Grid item sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={handleFilterClick}>
              <FilterList />
            </IconButton>
            <FilterPopover
              anchorEl={anchorEl}
              onClose={handleFilterClose}
              filterType={filterType}
              setFilterType={setFilterType}
              setFilterValue={setFilterValue}
              fetchTopicList={fetchTopicList}
              autoCompleteTopicsResults={autoCompleteTopicsResults}
              onFilterApply={handleFilterApply}
              t={t}
            />
            <FormControl
              sx={{
                display: "flex",
                flexDirection: vw?.xs ? "column" : "row",
                alignItems: "center",
                gap: 2,
              }}
              size="small"
            >
              <SelectFilter
                filterType="filterByPriority"
                currentValue={priorityFilter}
                onValueChange={createFilterChangeHandler(setPriorityFilter)}
              />
              <SelectFilter
                filterType="filterBySourceChannel"
                currentValue={sourceChannelFilter}
                onValueChange={createFilterChangeHandler(
                  setSourceChannelFilter
                )}
              />
            </FormControl>
      </Grid>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={handleStartDateChange}
        setEndDate={handleEndDateChange}
      />
      {(topicFilterUsed.length > 0 ||
        priorityFilter ||
        sourceChannelFilter !== "all" ||
        impactAreaFilterUsed.length > 0 ||
        (startDate || endDate)) && (
        <Grid item>
          <Button onClick={handleResetFilters}>
            {t("verificationRequest:resetFiltersButton")}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};
export default FilterManager;