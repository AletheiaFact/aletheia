import React from "react";
import { Grid, Typography } from "@mui/material";
import colors from "../styles/colors";

interface ErrorStateProps {
    message: string;
}

const ErrorState = ({ message }: ErrorStateProps) => {
    return (
        <Grid container
            justifyContent="center"
            marginTop={4}
        >
            <Grid item
                xs={6}
                display="flex"
                justifyContent="center"
                bgcolor={colors.lightNeutral}
                padding={2}
                borderRadius={2}
            >
                <Typography
                    variant="h1"
                    fontSize={18}
                >
                    {message}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default ErrorState;
