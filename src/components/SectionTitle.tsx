import React from "react";
import colors from "../styles/colors";
import Typography from "@mui/material/Typography"
import { Divider, Grid } from "@mui/material";

interface SectionTitleProps {
    children: string | React.ReactNode,
    hasDivider?: boolean
}

const SectionTitle = ({ children, hasDivider }: SectionTitleProps) => {
    return (
        <Grid container direction="column" style={{ marginBottom: "24px" }}>
            <Typography
                variant="h2"
                style={{
                    fontFamily: "initial",
                    fontSize: "24px",
                    lineHeight: "32px",
                    marginBottom: 4,
                    fontWeight: 500,
                    color: colors.neutral,
                }}
            >
                {children}
            </Typography >
            {
                hasDivider ?
                    <Divider variant="fullWidth" />
                    : null
            }
        </Grid>
    );
};

export default SectionTitle;
