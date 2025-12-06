import { FormControl } from "@mui/material";
import FilterPopover from "./FilterPopover";
import SelectFilter from "./SelectFilter";
import { useAppSelector } from "../../store/store";
import DateRangePicker from "../DateRangePicker";

const FilterBar = ({ state, actions }) => {
  const { vw } = useAppSelector((state) => state);
  const { priorityFilter, sourceChannelFilter, startDate, endDate } = state;

  const {
    setStartDate,
    setEndDate,
    setApplyFilters,
    setPaginationModel,
    setPriorityFilter,
    setSourceChannelFilter,
    createFilterChangeHandler,
  } = actions;

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setApplyFilters(true);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setApplyFilters(true);
  };

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
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={handleStartDateChange}
        setEndDate={handleEndDateChange}
      />
    </FormControl>
  );
};

export default FilterBar;
