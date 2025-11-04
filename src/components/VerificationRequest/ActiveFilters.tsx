import React from "react";
import { Grid, Typography, Chip } from "@mui/material";

const ActiveFilters = ({ topicFilterUsed, impactAreaFilterUsed, onRemoveFilter, t }) => (
    <Grid item xs={10}>
        <Typography variant="subtitle1" gutterBottom>
            {t("verificationRequest:activeFiltersLabel")}
        </Typography>
        <Grid container spacing={1}>
            {topicFilterUsed?.map((topic) => (
                <Grid item key={topic}>
                    <Chip
                        label={`${t(
                            "verificationRequest:topicFilterLabel"
                        )} ${topic}`}
                        onDelete={() =>
                            onRemoveFilter({
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
                            onRemoveFilter({
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
);

export default ActiveFilters;
