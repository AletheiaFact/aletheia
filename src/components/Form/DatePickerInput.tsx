import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import colors from "../../styles/colors";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import dayjs from "dayjs";

const StyledTextField = styled(TextField)`
  background: ${(props) => (props.$white ? colors.white : colors.lightNeutral)};
  box-shadow: 0px 2px 2px ${colors.shadow};
  border-radius: 4px;
  border: none;
  height: 48px;
  width: 100%;

  input {
    font-size: 16px;
  }

  input::placeholder {
    color: ${colors.blackSecondary};
  }

  .MuiOutlinedInput-root {
    fieldset {
      border: none;
    }

    &:hover fieldset {
      border: none;
    }

    &.Mui-focused fieldset {
      border: none;
    }
  }
`;

const DatePickerInput = (props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={t(props.placeholder)}
        value={value}
        inputFormat="DD/MM/YYYY"
        open={open}
        onClose={() => setOpen(false)}
        onChange={(newValue) => {
          setValue(newValue);
          props.onChange?.(newValue);
        }}
        maxDate={dayjs()}
        renderInput={(params) =>
          <StyledTextField
            {...params}
            onClick={() => setOpen(true)}
            {...props}
          />}
        PopperProps={{ placement: 'bottom-start', }}
        desktopModeMediaQuery="@media (min-width: 0)"
      />
    </LocalizationProvider>
  );
};

export default DatePickerInput;
