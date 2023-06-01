import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function SearchWithAutocomplete({
    options,
    handleOnChange,
    onSearch,
    value,
    t,
}) {
    return (
        <Autocomplete
            id="search-with-autocomplete"
            value={value}
            disableClearable
            options={options}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={props.id}>
                        {option}
                    </li>
                );
            }}
            onChange={(event, newValue) => handleOnChange(newValue)}
            style={{ width: "100%" }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t("search:searchInputLabel")}
                    onChange={(event) => onSearch(event.target.value)}
                />
            )}
        />
    );
}

export default SearchWithAutocomplete;
