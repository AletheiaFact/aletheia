import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ptBR } from "date-fns/locale";

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}) => {
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    const { t } = useTranslation();
    const today = new Date();

    return (
        <Box sx={{ display: "flex", gap: "8px" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                    label={t("verificationRequest:startDate")}
                    value={startDate}
                    maxDate={today}
                    open={openStart}
                    onClose={() => setOpenStart(false)}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => (
                        <TextField
                            size="small"
                            {...params}
                            onClick={() => setOpenStart(true)}
                        />
                    )}
                />
                <DatePicker
                    label={t("verificationRequest:endDate")}
                    value={endDate}
                    minDate={startDate ?? undefined}
                    maxDate={today}
                    open={openEnd}
                    onClose={() => setOpenEnd(false)}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => (
                        <TextField
                            size="small"
                            {...params}
                            onClick={() => setOpenEnd(true)}
                        />
                    )}
                />
            </LocalizationProvider>
        </Box>
    );
};

export default DateRangePicker;
