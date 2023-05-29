import React from "react";
import { TextField, Autocomplete } from "@mui/material";

const AdvancedSearch = ({
    onSearch,
    options,
    defaltValue,
    handleFilter,
    t,
}) => {
    return (
        <Autocomplete
            multiple
            id="tags-outlined"
            defaultValue={
                Array.isArray(defaltValue) ? defaltValue : [defaltValue]
            }
            options={options.map((option) => option.name)}
            onChange={(event, newValue) => handleFilter(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    style={{ backgroundColor: "#f8f9fa" }}
                    label={t("search:advancedSearchLabel")}
                    placeholder={t("search:advancedSearchPlaceHolder")}
                    onChange={(event) => onSearch(event.target.value)}
                />
            )}
        />
    );
};

export default AdvancedSearch;
