import * as React from "react";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
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

const getOptionsByLabelKey = (key: string): SelectOption[] => {
  switch (key) {
    case "filterByPriority":
      return [
        { value: "all", labelKey: "allPriorities" },
        { value: "critical", labelKey: "priorityCritical" },
        { value: "high", labelKey: "priorityHigh" },
        { value: "medium", labelKey: "priorityMedium" },
        { value: "low", labelKey: "priorityLow" },
      ];
    case "filterBySourceChannel":
      const allSourceOption = { value: "all", labelKey: "allSourceChannels" };
      const enumOptions = Object.values(VerificationRequestSourceChannel).map(channel => ({
        value: channel,
        labelKey: channel,
        fallbackLabel: channel.charAt(0).toUpperCase() + channel.slice(1), // Capitalize first letter but, just used when translation is missing
      }));
      return [allSourceOption, ...enumOptions];

    case "filterByTypeLabel":
      return [
        { value: "topics", labelKey: "topicsFilterOption" },
        { value: "impactArea", labelKey: "impactAreaFilterOption" },
      ];

    default:
      console.warn(`SelectFilter: No options defined for key: ${key}`);
      return [];
  }
};

const SelectFilter: React.FC<SelectFilterProps> = ({
  filterType,
  currentValue,
  onValueChange,
  minWidth = 200,
}) => {
  const { t } = useTranslation();
  const filterItem = getOptionsByLabelKey(filterType);

  const labelId = `${filterType}-label`;
  const label = t(`verificationRequest:${filterType}`);

  return (
    <FormControl
      sx={{ minWidth: minWidth }}
      size="small"
    >
      <InputLabel
        id={labelId}
      >
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        value={currentValue}
        label={label}
        onChange={(e: SelectChangeEvent<string>) => onValueChange(e.target.value)}
      >
        {
          filterItem.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
            >
              {t(`verificationRequest:${item.labelKey}`, item.fallbackLabel)}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;