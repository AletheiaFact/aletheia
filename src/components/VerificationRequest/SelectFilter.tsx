import * as React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { VerificationRequestSourceChannel } from "../../../server/verification-request/dto/types";

interface SelectOption {
  value: string;
  labelKey: string;
  fallbackLabel?: string;
}

interface SelectFilterProps {
  filterType: string;
  currentValue: string;
  onValueChange: (newValue: string) => void;
  minWidth?: number;
}

const filterActions: Record<string, () => SelectOption[]> = {
  filterByPriority: () => [
    { value: "all", labelKey: "allPriorities" },
    { value: "critical", labelKey: "priorityCritical" },
    { value: "high", labelKey: "priorityHigh" },
    { value: "medium", labelKey: "priorityMedium" },
    { value: "low", labelKey: "priorityLow" },
  ],

  filterBySourceChannel: () => {
    const allSourceOption = { value: "all", labelKey: "allSourceChannels" };

    const enumOptions = Object.values(VerificationRequestSourceChannel).map(
      (channel) => ({
        value: channel,
        labelKey: channel,
        fallbackLabel: channel.charAt(0).toUpperCase() + channel.slice(1),
      })
    );

    return [allSourceOption, ...enumOptions];
  },

  filterByTypeLabel: () => [
    { value: "topics", labelKey: "topicsFilterOption" },
    { value: "impactArea", labelKey: "impactAreaFilterOption" },
  ],
};

const getOptionsByFilterType = (filterType: string): SelectOption[] => {
  const filterOptions = filterActions[filterType];
  return filterOptions ? filterOptions() : [];
};

const SelectFilter: React.FC<SelectFilterProps> = ({
  filterType,
  currentValue,
  onValueChange,
  minWidth = 200,
}) => {
  const { t } = useTranslation();
  const filterItem = getOptionsByFilterType(filterType);

  const labelId = `${filterType}-label`;
  const label = t(`verificationRequest:${filterType}`);

  return (
    <FormControl sx={{ minWidth: minWidth }} size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={currentValue}
        label={label}
        onChange={(e: SelectChangeEvent<string>) =>
          onValueChange(e.target.value)
        }
      >
        {filterItem.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {t(`verificationRequest:${item.labelKey}`, item.fallbackLabel)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;
