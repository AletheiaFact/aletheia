import React from "react";
import { Grid, Typography, Chip } from "@mui/material";

const ActiveFilters = ({ topicFilterUsed, filtersUsed, onRemoveFilter, t }) => (
    <Grid item xs={10}>
        <Typography variant="subtitle1" gutterBottom>
            {t("verificationRequest:activeFiltersLabel")}
        </Typography>
        <Grid container spacing={1}>
            {topicFilterUsed.map((topic) => (
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
            {filtersUsed.map((filter) => (
                <Grid item key={filter}>
                    <Chip
                        label={`${t(
                            "verificationRequest:contentFilterLabel"
                        )} ${filter}`}
                        onDelete={() =>
                            onRemoveFilter({
                                label: `Content: ${filter}`,
                                value: filter,
                                type: "content",
                            })
                        }
                    />
                </Grid>
            ))}
        </Grid>
    </Grid>
);

export default ActiveFilters;
