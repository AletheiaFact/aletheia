import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const AdvancedSearch = ({ onSearch, options, defaltValue, handleFilter }) => {
    const { t } = useTranslation();
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
                    style={{ backgroundColor: colors.lightGray }}
                    label={t("search:advancedSearchLabel")}
                    placeholder={t("search:advancedSearchPlaceHolder")}
                    onChange={(event) => onSearch(event.target.value)}
                />
            )}
        />
    );
};

export default AdvancedSearch;
