import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

interface TopicOption {
    name: string;
    matchedAlias?: string | null;
    slug?: string;
    wikidataId?: string;
    aliases?: string[];
}

interface MappedOption {
    label: string;
    value: string;
}

interface AdvancedSearchProps {
    onSearch: (value: string) => void;
    options: TopicOption[];
    defaultValue?: string[] | MappedOption[];
    handleFilter: (names: string[]) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
    onSearch,
    options,
    defaultValue,
    handleFilter,
}) => {
    const { t } = useTranslation();

    const mappedOptions: MappedOption[] = options.map((option) => ({
        label: option.matchedAlias
            ? `${option.name} (${option.matchedAlias})`
            : option.name,
        value: option.name,
    }));

    const normalizedDefaultValue: (string | MappedOption)[] = defaultValue
        ? Array.isArray(defaultValue)
            ? defaultValue
            : [defaultValue]
        : [];

    return (
        <Autocomplete<string | MappedOption, true>
            multiple
            id="tags-outlined"
            defaultValue={normalizedDefaultValue}
            options={mappedOptions}
            getOptionLabel={(option) =>
                typeof option === "string" ? option : option.label
            }
            onChange={(event, newValue) => {
                const names = newValue.map((item) =>
                    typeof item === "string" ? item : item.value
                );
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
