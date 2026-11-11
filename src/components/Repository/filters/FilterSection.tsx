import React, { useId, useState } from "react";
import { Box, ButtonBase, Collapse, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import colors from "../../../styles/colors";

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    // Shows only the title until it is opened
    collapsible?: boolean;
    defaultOpen?: boolean;
}

const titleSx = {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.blackSecondary,
} as const;

const FilterSection = ({
    title,
    children,
    collapsible = false,
    defaultOpen = false,
}: FilterSectionProps) => {
    const [open, setOpen] = useState(defaultOpen);
    const contentId = useId();

    if (!collapsible) {
        return (
            <Box component="section" sx={{ mt: 3 }}>
                <Typography component="h3" sx={{ ...titleSx, mb: 1 }}>
                    {title}
                </Typography>
                {children}
            </Box>
        );
    }

    return (
        <Box component="section" sx={{ mt: 3 }}>
            <Typography component="h3" sx={titleSx}>
                <ButtonBase
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-controls={contentId}
                    sx={{
                        ...titleSx,
                        width: "100%",
                        justifyContent: "space-between",
                        py: 0.5,
                    }}
                >
                    {title}
                    <ExpandMoreIcon
                        fontSize="small"
                        sx={{
                            color: colors.neutralSecondary,
                            transition: "transform 150ms",
                            transform: open ? "rotate(180deg)" : "none",
                        }}
                    />
                </ButtonBase>
            </Typography>
            <Collapse in={open} id={contentId}>
                <Box sx={{ pt: 1 }}>{children}</Box>
            </Collapse>
        </Box>
    );
};

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
