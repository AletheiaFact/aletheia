import { FormControl } from "@mui/material";
import FilterPopover from "./FilterPopover";
import SelectFilter from "./SelectFilter";
import { useAppSelector } from "../../store/store";

const FilterBar = ({
  state,
  actions,
  priorityFilter,
  sourceChannelFilter,
  setPriorityFilter,
  setSourceChannelFilter,
  createFilterChangeHandler,
}) => {
  const { vw } = useAppSelector((state) => state);

  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: vw?.xs ? "column" : "row",
        gap: 2,
      }}
      size="small"
    >
      <FilterPopover state={state} actions={actions} />
      <SelectFilter
        filterType="filterByPriority"
        currentValue={priorityFilter}
        onValueChange={createFilterChangeHandler(setPriorityFilter)}
      />
      <SelectFilter
        filterType="filterBySourceChannel"
        currentValue={sourceChannelFilter}
        onValueChange={createFilterChangeHandler(setSourceChannelFilter)}
      />
    </FormControl>
  );
};

export default FilterBar;
