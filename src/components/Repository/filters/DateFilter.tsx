import React from "react";
import { useTranslation } from "next-i18next";
import DateRangePicker from "../../DateRangePicker";
import FilterSection from "./FilterSection";
import { FiltersChangeHandler, RepositoryTab } from "../repositoryFilters";

interface DateFilterProps {
    tab: RepositoryTab;
    startDate: Date | null;
    endDate: Date | null;
    onChange: FiltersChangeHandler;
}

const DateFilter = ({ tab, startDate, endDate, onChange }: DateFilterProps) => {
    const { t } = useTranslation();

    return (
        <FilterSection
            title={t(
                tab === "claims" ? "repository:claimDate" : "repository:reviewDate"
            )}
        >
            <DateRangePicker
                label={null}
                fullWidth
                startDate={startDate}
                endDate={endDate}
                setStartDate={(date: Date | null) =>
                    onChange({ startDate: date })
                }
                setEndDate={(date: Date | null) => onChange({ endDate: date })}
            />
        </FilterSection>
    );
};

export default DateFilter;
