import React from "react";
import { Box, Typography } from "@mui/material";
import colors from "../../../styles/colors";

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => (
    <Box component="section" sx={{ mt: 3 }}>
        <Typography
            component="h3"
            sx={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: colors.blackSecondary,
                mb: 1,
            }}
        >
            {title}
        </Typography>
        {children}
    </Box>
);

// app.css paints every ToggleButton dark; only the selected one is here.
const toggleButton = "& button.MuiButtonBase-root.MuiToggleButton-root";
export const toggleGroupSx = {
    width: "100%",
    [toggleButton]: {
        flex: 1,
        textTransform: "none",
        fontWeight: 600,
        borderWidth: 1,
        background: colors.white,
        color: colors.primary,
    },
    [`${toggleButton}.Mui-selected, ${toggleButton}.Mui-selected:hover`]: {
        background: colors.primary,
        color: colors.white,
    },
};

export default FilterSection;
