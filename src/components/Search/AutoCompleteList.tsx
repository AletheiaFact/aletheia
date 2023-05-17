import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function SearchWithAutocomplete({ options, handleOnChange, onSearch, value }) {
    return (
        <Autocomplete
            freeSolo
            value={value}
            disableClearable
            options={options}
            onChange={(event, newValue) => handleOnChange(newValue)}
            style={{ width: "100%" }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search"
                    onChange={(event) => onSearch(event.target.value)}
                />
            )}
        />
    );
}

export default SearchWithAutocomplete;
