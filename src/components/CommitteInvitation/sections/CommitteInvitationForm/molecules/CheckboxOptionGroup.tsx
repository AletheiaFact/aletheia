import React from "react";
import { Box, Checkbox, FormControlLabel, Stack, SxProps } from "@mui/material";
import FieldLabel from "../atoms/FieldLabel";

interface CheckboxOptionGroupProps {
    label: string;
    options: string[];
    selected: string[];
    getOptionLabel: (option: string) => string;
    onToggle: (option: string) => void;
    sx?: SxProps;
}

const CheckboxOptionGroup = ({
    label,
    options,
    selected,
    getOptionLabel,
    onToggle,
    sx,
}: CheckboxOptionGroupProps) => (
    <Box sx={sx}>
        <FieldLabel required>{label}</FieldLabel>
        <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap sx={{ mt: 1 }}>
            {options.map((option) => (
                <FormControlLabel
                    key={option}
                    className={`checkbox-card ${
                        selected.includes(option) ? "selected" : ""
                    }`}
                    control={
                        <Checkbox
                            checked={selected.includes(option)}
                            onChange={() => onToggle(option)}
                        />
                    }
                    label={getOptionLabel(option)}
                />
            ))}
        </Stack>
    </Box>
);

export default CheckboxOptionGroup;
