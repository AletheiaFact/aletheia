import React from "react";
import { Grid, Popover, Button, FormControl, IconButton } from "@mui/material";
import AdvancedSearch from "../Search/AdvancedSearch";
import SelectFilter from "./SelectFilter";
import { FilterList } from "@mui/icons-material";
import { ActionTypes } from "../../store/types";

const FilterPopover = ({ state, actions }) => {
  const {
    anchorEl,
    filterType,
    filterValue,
    topicFilterUsed,
    impactAreaFilterUsed,
    autoCompleteTopicsResults,
  } = state;

  const {
    setFilterValue,
    fetchTopicList,
    setApplyFilters,
    setFilterType,
    setAnchorEl,
    dispatch,
    t,
  } = actions;

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
    setApplyFilters(true);
  };

  return (
    <Grid>
      <IconButton onClick={handleFilterClick}>
        <FilterList />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <SelectFilter
                filterType="filterByTypeLabel"
                currentValue={filterType}
                onValueChange={(e) => setFilterType(e)}
              />
            </FormControl>
          </Grid>
          {filterType === "topics" && (
            <Grid item xs={12}>
              <AdvancedSearch
                defaultValue={[]}
                onSearch={fetchTopicList}
                options={autoCompleteTopicsResults}
                handleFilter={setFilterValue}
              />
            </Grid>
          )}
          {filterType === "impactArea" && (
            <Grid item xs={12}>
              <AdvancedSearch
                defaultValue={[]}
                onSearch={fetchTopicList}
                options={autoCompleteTopicsResults}
                handleFilter={setFilterValue}
              />
            </Grid>
          )}
          <Grid item xs={12} container justifyContent="flex-end">
            <Button onClick={handleFilterApply}>
              {t("verificationRequest:applyButtonLabel")}
            </Button>
          </Grid>
        </Grid>
      </Popover>
    </Grid>
  );
};

export default FilterPopover;
