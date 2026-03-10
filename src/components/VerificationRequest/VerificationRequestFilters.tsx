import FilterManager from "./FilterManagers";
import ActiveFilters from "./ActiveFilters";
import { Box, Grid } from "@mui/material";

const VerificationRequestFilters = ({ state, actions }) => {
    return (
        <Box className="filtersContainer">
            <Grid container justifyContent="center">
                <Grid item xs={11} lg={8} xl={7} padding="18px 0" >
                    <FilterManager state={state} actions={actions} />
                    <ActiveFilters state={state} actions={actions} />
                </Grid>
            </Grid>
        </Box >
    )
}

export default VerificationRequestFilters
