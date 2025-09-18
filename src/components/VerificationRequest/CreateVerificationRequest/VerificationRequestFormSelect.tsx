import * as React from "react";
import { MenuItem, FormControl } from "@mui/material";
import { ContentModelEnum } from "../../../types/enums";
import { SelectInput } from "../../Form/ClaimReviewSelect";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ReportTypeSelect = ({
  onChange,
  defaultValue,
  placeholder,
  style = {},
}) => {
  const [value, setValue] = useState(defaultValue || "");
  const { t } = useTranslation();

  const onChangeSelect = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <FormControl fullWidth>
      <SelectInput
        displayEmpty
        onChange={onChangeSelect}
        value={value}
        style={style}
      >
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
        {Object.values(ContentModelEnum).map((option) => (
          <MenuItem key={option} value={option}>
            {t(`claimForm:${option}`)}
          </MenuItem>
        ))}
      </SelectInput>
    </FormControl>
  );
};

export default ReportTypeSelect;
