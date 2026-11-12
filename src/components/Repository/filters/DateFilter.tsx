import React from "react";
import { Box, ButtonBase } from "@mui/material";
import { useTranslation } from "next-i18next";
import { addDays, isSameDay, startOfDay, subDays, subYears } from "date-fns";
import colors from "../../../styles/colors";
import DateRangePicker from "../../DateRangePicker";
import FilterSection from "./FilterSection";
import { FiltersChangeHandler, RepositoryTab } from "../repositoryFilters";

// Each shortcut is the period ending today
const PRESETS = [
    {
        key: "7d",
        label: "repository:presetLast7Days",
        start: (today: Date) => subDays(today, 6),
    },
    {
        key: "30d",
        label: "repository:presetLast30Days",
        start: (today: Date) => subDays(today, 29),
    },
    {
        key: "year",
        label: "repository:presetLastYear",
        ariaLabel: "repository:presetLastYearLabel",
        start: (today: Date) => addDays(subYears(today, 1), 1),
    },
];

interface DateFilterProps {
    tab: RepositoryTab;
    startDate: Date | null;
    endDate: Date | null;
    onChange: FiltersChangeHandler;
}

const DateFilter = ({ tab, startDate, endDate, onChange }: DateFilterProps) => {
    const { t } = useTranslation();
    const today = startOfDay(new Date());

    return (
        <FilterSection
            title={t(
                tab === "claims" ? "repository:claimDate" : "repository:reviewDate"
            )}
        >
            <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                {PRESETS.map((preset) => {
                    const presetStart = preset.start(today);
                    const active =
                        !!startDate &&
                        !!endDate &&
                        isSameDay(startDate, presetStart) &&
                        isSameDay(endDate, today);
                    return (
                        <ButtonBase
                            key={preset.key}
                            aria-pressed={active}
                            aria-label={
                                preset.ariaLabel ? t(preset.ariaLabel) : undefined
                            }
                            onClick={() =>
                                onChange(
                                    active
                                        ? { startDate: null, endDate: null }
                                        : { startDate: presetStart, endDate: today }
                                )
                            }
                            data-cy={`testRepositoryDatePreset-${preset.key}`}
                            sx={{
                                height: 30,
                                px: 1.5,
                                borderRadius: 1,
                                fontSize: 12,
                                border: `1px solid ${
                                    active ? colors.primary : colors.neutralTertiary
                                }`,
                                backgroundColor: active
                                    ? colors.primary
                                    : colors.white,
                                color: active ? colors.white : colors.neutral,
                                "&:hover": {
                                    borderColor: colors.primary,
                                },
                            }}
                        >
                            {t(preset.label)}
                        </ButtonBase>
                    );
                })}
            </Box>
            <DateRangePicker
                label={null}
                fullWidth
                clearable
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
