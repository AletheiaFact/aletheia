import { ViewList, ViewModule } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const FilterToggleButtons = ({ viewMode, setViewMode }) => (
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
  >
    <ToggleButton value="board" aria-label="board view">
      <ViewModule />
    </ToggleButton>
    <ToggleButton value="dashboard" aria-label="dashboard view">
      <ViewList />
    </ToggleButton>
  </ToggleButtonGroup>
);

export default FilterToggleButtons;
