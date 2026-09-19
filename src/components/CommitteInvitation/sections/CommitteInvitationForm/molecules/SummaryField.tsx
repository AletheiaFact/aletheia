import React from "react";
import { Grid, Typography } from "@mui/material";

interface SummaryFieldProps {
    label: string;
    value: string;
}

const SummaryField = ({ label, value }: SummaryFieldProps) => (
    <Grid item xs={6} sm={3}>
        <Typography variant="caption" className="summary-label">
            {label}
        </Typography>
        <Typography variant="body2" className="summary-value">
            {value || "—"}
        </Typography>
    </Grid>
);

export default SummaryField;
