import SelectFilter from "./SelectFilter";
import DateRangePicker from "../DateRangePicker";

const FilterBar = ({ state, actions }) => {
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
        <>
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
        </>
    );
};

export default FilterBar;
