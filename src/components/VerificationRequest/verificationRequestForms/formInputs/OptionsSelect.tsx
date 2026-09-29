import * as React from "react";
import { MenuItem, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import { SelectInput } from "../../../Form/ClaimReviewSelect";
import { IOptionsSelect } from "../../../../types/VerificationRequest";

/**
 * Select over a predefined list of options. Emits the selected option value,
 * or undefined while nothing is selected.
 */
const OptionsSelect = ({
    options,
    onChange,
    defaultValue,
    placeholder,
    style = {},
    isDisabled,
    dataCy,
}: IOptionsSelect) => {
    const [value, setValue] = useState(defaultValue || "");

    useEffect(() => {
        onChange(value || undefined);
    }, [value, onChange]);

    // Options may load asynchronously: show the placeholder until the value
    // has a matching option, so MUI never receives an out-of-range value.
    const hasOption = options.some((option) => option.value === value);

    return (
        <FormControl fullWidth>
            <SelectInput
                displayEmpty
                onChange={(e) => setValue(e.target.value as string)}
                value={hasOption ? value : ""}
                style={style}
                disabled={isDisabled}
                data-cy={dataCy}
            >
                <MenuItem value="" disabled>
                    {placeholder}
                </MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </SelectInput>
        </FormControl>
    );
};

export default OptionsSelect;
