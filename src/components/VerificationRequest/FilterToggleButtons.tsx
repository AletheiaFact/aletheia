import { ViewList, ViewModule } from "@mui/icons-material";
import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import colors from "../../styles/colors";
import FilterPopover from "./FilterPopover";

const FilterToggleButtons = ({ viewMode, setViewMode, state, actions }) => {
    return (
        <Grid item display="flex" gap={2}>
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
                <ToggleButton value="board" aria-label="board view">
                    <ViewModule />
                </ToggleButton>
                <ToggleButton value="dashboard" aria-label="dashboard view">
                    <ViewList />
                </ToggleButton>
            </ToggleButtonGroup>
            <FilterPopover state={state} actions={actions} />
        </Grid>
    )
};

export default FilterToggleButtons;
