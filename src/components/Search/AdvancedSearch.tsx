import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const AdvancedSearch = ({ onSearch, options, defaultValue, handleFilter }) => {
    const { t } = useTranslation();

    const mappedOptions = options.map((option) => ({
        label: option.matchedAlias
            ? `${option.name} (${option.matchedAlias})`
            : option.name,
        value: option.name,
    }));

    return (
        <Autocomplete
            multiple
            id="tags-outlined"
            defaultValue={
                Array.isArray(defaultValue) ? defaultValue : [defaultValue]
            }
            options={mappedOptions}
            getOptionLabel={(option) => option.label || option}
            onChange={(event, newValue) => {
                const names = newValue.map((item) => item.value || item);
                handleFilter(names);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    style={{ backgroundColor: colors.lightNeutral }}
                    label={t("search:advancedSearchLabel")}
                    placeholder={t("search:advancedSearchPlaceHolder")}
                    onChange={(event) => onSearch(event.target.value)}
                />
            )}
        />
    );
};

export default AdvancedSearch;
