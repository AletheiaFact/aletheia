import { Alert, useTheme, Grid, AlertTitle } from "@mui/material";
import React from "react";
import colors from "../styles/colors";

const AletheiaAlert = ({
    type,
    message,
    description = null,
    action = null,
    showIcon = false,
    style = {},
    ...props
}) => {
    const theme = useTheme();
    const colorMap = {
        success: theme.palette.success.main,
        info: theme.palette.info.main,
        warning: theme.palette.warning.main,
        error: theme.palette.error.main,
    };

    return (
        <Alert
            severity={type}
            icon={showIcon && undefined}
            style={{
                marginBottom: "15px",
                padding: "25px",
                color: colors.blackTertiary,
                border: `1px solid ${colorMap[type]}`,
                ...style,
            }}
            {...props}
        >
            <AlertTitle style={{ fontSize: "14px", ...style }}>
                {message}
            </AlertTitle>
            {description && (
                <p style={{ fontSize: "12px" }}>
                    {description}
                </p>
            )}
            {action && (
                <Grid item xs={12}>
                    {action}
                </Grid>
            )}
        </Alert>
    );
};

export default AletheiaAlert;
