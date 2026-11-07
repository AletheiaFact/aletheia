import React, { useRef, useState } from "react";
import {
    Box,
    Button,
    InputAdornment,
    Popover,
    TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import {
    CalendarPicker,
    LocalizationProvider,
    PickersDay,
    PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR as ptBRPickers } from "@mui/x-date-pickers/locales";
import { format, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import colors from "../styles/colors";

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    // null hides the label, for containers that already title the field
    label?: string | null;
    fullWidth?: boolean;
}

interface RangeDayProps extends PickersDayProps<Date> {
    inRange: boolean;
    isStart: boolean;
    isEnd: boolean;
}

// The free MUI X calendar has no range mode (DateRangePicker is MUI X
// Pro), so each day paints its own part of the range band.
const RangeDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== "inRange" && prop !== "isStart" && prop !== "isEnd",
})<RangeDayProps>(({ inRange, isStart, isEnd }) => ({
    ...(inRange && {
        borderRadius: 0,
        backgroundColor: colors.lightTertiary,
        color: colors.primary,
        "&:hover, &:focus": { backgroundColor: colors.tertiary },
    }),
    ...((isStart || isEnd) && {
        backgroundColor: colors.primary,
        color: colors.white,
        "&:hover, &:focus": { backgroundColor: colors.primaryHover },
    }),
    ...(isStart && {
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
    }),
    ...(isEnd && {
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
    }),
}));

const formatDay = (date: Date) => format(date, "dd/MM/yyyy");
// Both ends with a two-digit year, so a full range fits a sidebar field
const formatRangeDay = (date: Date) => format(date, "dd/MM/yy");

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    label,
    fullWidth = false,
}) => {
    const { t, i18n } = useTranslation();
    const anchorRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    // The range being picked; applied when the second day is chosen
    const [draftStart, setDraftStart] = useState<Date | null>(null);
    const [draftEnd, setDraftEnd] = useState<Date | null>(null);
    const [hovered, setHovered] = useState<Date | null>(null);

    const apply = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    const openCalendar = () => {
        setDraftStart(startDate);
        setDraftEnd(endDate);
        setHovered(null);
        setOpen(true);
    };

    const closeCalendar = () => {
        setOpen(false);
        // Only a start picked: keep it as "from that day on", unless that
        // is already the applied value
        const unchanged =
            !endDate && !!startDate && isSameDay(draftStart ?? 0, startDate);
        if (draftStart && !draftEnd && !unchanged) {
            apply(draftStart, null);
        }
    };

    const handleDayClick = (value: Date | null) => {
        if (!value) return;
        const day = startOfDay(value);
        if (!draftStart || draftEnd || isBefore(day, draftStart)) {
            setDraftStart(day);
            setDraftEnd(null);
            return;
        }
        setDraftEnd(day);
        setOpen(false);
        apply(draftStart, day);
    };

    const clear = () => {
        setDraftStart(null);
        setDraftEnd(null);
        setOpen(false);
        apply(null, null);
    };

    // While only the start is set, the hovered day previews the end
    const rangeEnd =
        draftEnd ??
        (draftStart && hovered && !isBefore(hovered, draftStart)
            ? hovered
            : null);

    const renderDay = (
        day: Date,
        _selectedDays: Date[],
        pickersDayProps: PickersDayProps<Date>
    ) => {
        const isStart = !!draftStart && isSameDay(day, draftStart);
        const isEnd = !!rangeEnd && isSameDay(day, rangeEnd);
        const inRange =
            !!draftStart &&
            !!rangeEnd &&
            !isBefore(day, draftStart) &&
            !isAfter(day, rangeEnd);
        return (
            <RangeDay
                {...pickersDayProps}
                selected={false}
                inRange={inRange && !pickersDayProps.outsideCurrentMonth}
                isStart={isStart && !pickersDayProps.outsideCurrentMonth}
                isEnd={isEnd && !pickersDayProps.outsideCurrentMonth}
                onMouseEnter={() => setHovered(day)}
            />
        );
    };

    let displayValue = "";
    if (startDate && endDate) {
        displayValue = `${formatRangeDay(startDate)} – ${formatRangeDay(endDate)}`;
    } else if (startDate) {
        displayValue = t("common:dateRangeFrom", { date: formatDay(startDate) });
    } else if (endDate) {
        displayValue = t("common:dateRangeUntil", { date: formatDay(endDate) });
    }

    const fieldLabel =
        label === undefined ? t("common:dateRangeLabel") : label ?? undefined;

    return (
        <>
            <TextField
                ref={anchorRef}
                size="small"
                fullWidth={fullWidth}
                label={fieldLabel}
                value={displayValue}
                placeholder={t("common:dateRangePlaceholder")}
                onClick={openCalendar}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openCalendar();
                    }
                }}
                InputProps={{
                    readOnly: true,
                    startAdornment: (
                        <InputAdornment position="start">
                            <CalendarMonthOutlinedIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
                inputProps={{
                    "aria-haspopup": "dialog",
                    "aria-expanded": open,
                    style: { cursor: "pointer", fontSize: 14 },
                }}
                sx={{
                    backgroundColor: colors.white,
                    minWidth: fullWidth ? undefined : 240,
                }}
                data-cy="testDateRangeInput"
            />
            <Popover
                open={open}
                anchorEl={anchorRef.current}
                onClose={closeCalendar}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                slotProps={{ paper: { role: "dialog" } }}
            >
                <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ptBR}
                    // Button labels such as "Previous month"
                    localeText={
                        i18n.language?.startsWith("pt")
                            ? ptBRPickers.components.MuiLocalizationProvider
                                  .defaultProps.localeText
                            : undefined
                    }
                >
                    <Box onMouseLeave={() => setHovered(null)}>
                        <CalendarPicker
                            date={draftEnd ?? draftStart ?? endDate ?? null}
                            onChange={handleDayClick}
                            disableFuture
                            renderDay={renderDay}
                        />
                    </Box>
                </LocalizationProvider>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        px: 2,
                        pb: 1.5,
                    }}
                >
                    <Button
                        size="small"
                        onClick={clear}
                        sx={{ textTransform: "none" }}
                        data-cy="testDateRangeClear"
                    >
                        {t("common:dateRangeClear")}
                    </Button>
                </Box>
            </Popover>
        </>
    );
};

export default DateRangePicker;
