import React, { useRef, useState } from "react";
import {
    Box,
    IconButton,
    InputAdornment,
    Popover,
    TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
    CalendarPicker,
    LocalizationProvider,
    PickersDay,
    PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR as ptBRPickers } from "@mui/x-date-pickers/locales";
import {
    getDay,
    getDaysInMonth,
    isAfter,
    isBefore,
    isSameDay,
    startOfDay,
    startOfMonth,
} from "date-fns";
import { useTranslation } from "react-i18next";
import colors from "../styles/colors";
import { formatDateRange, getDateFormat } from "../utils/dateRangeFormat";
import AletheiaButton, { ButtonType } from "./AletheiaButton";

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    // null hides the label, for containers that already title the field
    label?: string | null;
    fullWidth?: boolean;
    // Shows a × in the field that clears the period
    clearable?: boolean;
}

// MUI's day is 36px with a 2px margin on each side, so a cell is 40px wide
// and a week 40px tall.
const CELL_WIDTH = 40;
const DAY_SIZE = 36;
const WEEK_HEIGHT = 40;
const TODAY_SIZE = 32;

interface RangeDayProps extends PickersDayProps<Date> {
    inRange: boolean;
    isStart: boolean;
    isEnd: boolean;
}

// The free MUI X calendar has no range mode (DateRangePicker is MUI X
// Pro), so each day paints its own part of the range band. The start and
// end are a full circle over the band, drawn as background layers so hover
// and focus can't recolour them.
const RangeDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== "inRange" && prop !== "isStart" && prop !== "isEnd",
})<RangeDayProps>(({ inRange, isStart, isEnd }) => {
    const isEdge = isStart || isEnd;
    const band = colors.lightTertiary;
    // Which half of an edge day the band covers, if any
    let bandHalf = "";
    if (isStart && !isEnd) bandHalf = "right";
    if (isEnd && !isStart) bandHalf = "left";
    const circle = `radial-gradient(circle, ${colors.primary} ${
        DAY_SIZE / 2 - 0.5
    }px, transparent ${DAY_SIZE / 2}px)`;
    const edgeBackground = bandHalf
        ? `${circle}, linear-gradient(to ${bandHalf}, transparent 50%, ${band} 50%)`
        : circle;

    // Range days fill the whole cell, so the band has no gaps
    const fullCell = {
        width: CELL_WIDTH,
        height: DAY_SIZE,
        margin: 0,
        borderRadius: 0,
        // Inside the range, today needs no ring of its own
        "&.MuiPickersDay-today:not(.Mui-selected)": {
            width: CELL_WIDTH,
            height: DAY_SIZE,
            margin: 0,
            border: "none",
            boxShadow: "none",
            borderRadius: 0,
        },
    };

    return {
        // A thinner, smaller ring for today, centred in its cell
        "&.MuiPickersDay-today:not(.Mui-selected)": {
            border: "none",
            boxShadow: `inset 0 0 0 1px ${colors.neutralSecondary}`,
            width: TODAY_SIZE,
            height: TODAY_SIZE,
            margin: `${(DAY_SIZE - TODAY_SIZE) / 2}px ${
                (CELL_WIDTH - TODAY_SIZE) / 2
            }px`,
        },
        ...(inRange &&
            !isEdge && {
                ...fullCell,
                backgroundColor: band,
                color: colors.primary,
                "&:hover, &:focus, &.Mui-focusVisible": {
                    backgroundColor: colors.tertiary,
                },
            }),
        ...(isEdge && {
            ...fullCell,
            background: edgeBackground,
            color: colors.white,
            fontWeight: 600,
            "&:hover, &:focus, &.Mui-focusVisible": {
                background: edgeBackground,
            },
        }),
    };
});

// Rows the month needs (4 to 6), so the calendar has no empty last row
const weeksInMonth = (month: Date) =>
    Math.ceil((getDay(startOfMonth(month)) + getDaysInMonth(month)) / 7);

const calendarSx = {
    // "< Novembro 2026 ▾ >": the arrows around the month. The arrow
    // switcher is flattened so its buttons can be ordered around the label.
    "& .MuiPickersCalendarHeader-root": {
        px: 1.5,
        justifyContent: "space-between",
    },
    "& .MuiPickersArrowSwitcher-root": { display: "contents" },
    "& .MuiPickersArrowSwitcher-spacer": { display: "none" },
    "& .MuiPickersArrowSwitcher-button:first-of-type": { order: -1 },
    "& .MuiPickersCalendarHeader-labelContainer": {
        mx: "auto",
        textTransform: "capitalize",
    },
    "& .MuiPickersCalendarHeader-switchViewButton": { mr: 0 },
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    label,
    fullWidth = false,
    clearable = false,
}) => {
    const { t, i18n } = useTranslation();
    const isPortuguese = i18n.language?.startsWith("pt");
    const anchorRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    // The range being picked; applied when the second day is chosen
    const [draftStart, setDraftStart] = useState<Date | null>(null);
    const [draftEnd, setDraftEnd] = useState<Date | null>(null);
    const [hovered, setHovered] = useState<Date | null>(null);
    // The month on screen, to size the calendar to its weeks
    const [viewMonth, setViewMonth] = useState<Date>(new Date());

    const apply = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    const openCalendar = () => {
        setDraftStart(startDate);
        setDraftEnd(endDate);
        setHovered(null);
        setViewMonth(endDate ?? startDate ?? new Date());
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
        const isEnd =
            (!!rangeEnd && isSameDay(day, rangeEnd)) ||
            // A start without an end is a single circle
            (isStart && !rangeEnd);
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

    const displayValue = formatDateRange(startDate, endDate, i18n.language, t);
    const fieldLabel =
        label === undefined ? t("common:dateRangeLabel") : label ?? undefined;
    const showClear = clearable && !!(startDate || endDate);

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
                    endAdornment: showClear && (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                edge="end"
                                aria-label={t("common:dateRangeClear")}
                                onClick={(event) => {
                                    // Clearing must not open the calendar
                                    event.stopPropagation();
                                    clear();
                                }}
                                data-cy="testDateRangeFieldClear"
                            >
                                <CloseIcon sx={{ fontSize: 16 }} />
                            </IconButton>
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
                    adapterLocale={getDateFormat(i18n.language).locale}
                    // Button labels such as "Previous month"
                    localeText={
                        isPortuguese
                            ? ptBRPickers.components.MuiLocalizationProvider
                                  .defaultProps.localeText
                            : undefined
                    }
                >
                    <Box
                        onMouseLeave={() => setHovered(null)}
                        sx={{
                            ...calendarSx,
                            "& .MuiDayPicker-slideTransition": {
                                minHeight:
                                    weeksInMonth(viewMonth) * WEEK_HEIGHT,
                            },
                        }}
                    >
                        <CalendarPicker
                            date={draftEnd ?? draftStart ?? endDate ?? null}
                            onChange={handleDayClick}
                            onMonthChange={(month) => setViewMonth(month)}
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
                    <AletheiaButton
                        type={ButtonType.whiteOutline}
                        size="small"
                        onClick={clear}
                        data-cy="testDateRangeClear"
                    >
                        {t("common:dateRangeClear")}
                    </AletheiaButton>
                </Box>
            </Popover>
        </>
    );
};

export default DateRangePicker;
