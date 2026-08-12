import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

interface FormProgressStepProps {
    label: string;
    active: boolean;
    completed: boolean;
}

const FormProgressStep = ({ label, active, completed }: FormProgressStepProps) => (
    <Grid item xs={3}>
        <Box className={`form-progress-bar ${active ? "active" : ""}`} />
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
            {completed && <CheckCircle className="form-progress-check" />}
            <Typography
                variant="caption"
                className={`form-progress-label ${active ? "active" : ""}`}
            >
                {label}
            </Typography>
        </Stack>
    </Grid>
);

export default FormProgressStep;
