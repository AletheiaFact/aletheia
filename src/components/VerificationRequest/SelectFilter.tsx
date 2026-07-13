import * as React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { VerificationRequestSourceChannel } from "../../../server/verification-request/dto/types";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import { useTranslations } from "next-intl";

interface SelectOption {
  value: string;
  labelKey: string;
  fallbackLabel?: string;
}

interface SelectFilterProps {
  filterType: string;
  currentValue: string;
  onValueChange: (newValue: string) => void;
}

const filterActions: Record<string, () => SelectOption[]> = {
  filterByPriority: () => [
    { value: "all", labelKey: "allPriorities" },
    { value: "critical", labelKey: "priority.critical" },
    { value: "high", labelKey: "priority.filter_high" },
    { value: "medium", labelKey: "priority.filter_medium" },
    { value: "low", labelKey: "priority.filter_low" },
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
}) => {
  const tVerificationRequest = useTranslations("verificationRequest");
  const filterItem = getOptionsByFilterType(filterType);
  const { vw } = useAppSelector((state) => state);

  const labelId = `${filterType}-label`;
  const label = tVerificationRequest(`${filterType}`);

  return (
    <FormControl sx={{ minWidth: vw?.xs ? "100%" : "200px", backgroundColor: colors.white }} size="small">
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
            {tVerificationRequest(item.labelKey) || item.fallbackLabel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;
