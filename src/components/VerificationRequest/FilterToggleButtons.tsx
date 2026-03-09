import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import colors from "../../styles/colors";
import { ViewMode } from "../../types/VerificationRequest";

type FilterToggleProps = {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    leftOption: React.ReactNode;
    rightOption: React.ReactNode;
    isRounded?: boolean
}

const FilterToggleButtons = ({ viewMode, setViewMode, leftOption, rightOption, isRounded }: FilterToggleProps) => {
    return (
        <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newView) => {
                if (newView !== null) {
                    setViewMode(newView);
                }
            }}
            aria-label="view mode"
            size="small"
            sx={{
                "& .MuiToggleButton-root": {
                    textTransform: "none",
                },
                "& .MuiToggleButton-root:not(.Mui-selected)": {
                    backgroundColor: colors.lightNeutral,
                    color: colors.shadow,
                    "&:hover": {
                        backgroundColor: colors.lightNeutralSecondary,
                    },
                },
                "& .Mui-selected": {
                    backgroundColor: colors.primary,
                    "&:hover": {
                        backgroundColor: colors.primary,
                    },
                },
            }}
        >
            <ToggleButton
                value="left"
                aria-label="board view"
                style={{ borderRadius: isRounded ? "50px 0px 0px 50px " : "4px" }}
            >
                {leftOption}
            </ToggleButton>
            <ToggleButton
                value="right"
                aria-label="dashboard view"
                style={{ borderRadius: isRounded ? "0px 50px 50px 0px " : "4px" }}
            >
                {rightOption}
            </ToggleButton>
        </ToggleButtonGroup>
    )
};

export default FilterToggleButtons;
