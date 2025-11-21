import React from "react";
import { Grid, Typography, Chip } from "@mui/material";
import { ActionTypes } from "../../store/types";

const ActiveFilters = ({ state, actions }) => {
  const { topicFilterUsed, impactAreaFilterUsed } = state;
  const { dispatch, t, setPaginationModel, setApplyFilters } = actions;

  const handleRemoveFilter = (removedFilter) => {
    if (removedFilter.type === "topic") {
      const updatedTopics = topicFilterUsed.filter(
        (topic) => topic !== removedFilter.value
      );
      dispatch({
        type: ActionTypes.SET_TOPIC_FILTER_USED,
        topicFilterUsed: updatedTopics,
      });
    } else if (removedFilter.type === "impactArea") {
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

  return (
    (topicFilterUsed.length > 0 || impactAreaFilterUsed.length > 0) && (
      <Grid item xs={10}>
        <Typography variant="subtitle1" gutterBottom>
          {t("verificationRequest:activeFiltersLabel")}
        </Typography>
        <Grid container spacing={1}>
          {topicFilterUsed?.map((topic) => (
            <Grid item key={topic}>
              <Chip
                label={`${t("verificationRequest:topicFilterLabel")} ${topic}`}
                onDelete={() =>
                  handleRemoveFilter({
                    label: `Topic: ${topic}`,
                    value: topic,
                    type: "topic",
                  })
                }
              />
            </Grid>
          ))}
          {impactAreaFilterUsed?.map((impactArea) => (
            <Grid item key={impactArea}>
              <Chip
                label={`${t(
                  "verificationRequest:impactAreaFilterLabel"
                )} ${impactArea}`}
                onDelete={() =>
                  handleRemoveFilter({
                    label: `Impact Area: ${impactArea}`,
                    value: impactArea,
                    type: "impactArea",
                  })
                }
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    )
  );
};

export default ActiveFilters;
