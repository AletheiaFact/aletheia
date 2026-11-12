import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { NamedOption } from "./repositoryFilters";

interface AsyncOptionFilterProps {
    value: NamedOption | null;
    onChange: (value: NamedOption | null) => void;
    fetchOptions: (text: string) => Promise<NamedOption[]>;
    placeholder: string;
    dataCy: string;
}

const AsyncOptionFilter = ({
    value,
    onChange,
    fetchOptions,
    placeholder,
    dataCy,
}: AsyncOptionFilterProps) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState(value?.name ?? "");
    const [options, setOptions] = useState<NamedOption[]>([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (searchText.length < 2) {
            setOptions([]);
            setLoading(false);
            return;
        }
        let active = true;
        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const result = await fetchOptions(searchText);
                if (active) setOptions(result);
            } catch {
                if (active) setOptions([]);
            } finally {
                if (active) setLoading(false);
            }
        }, 400);
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [searchText, fetchOptions]);

    const handleInputChange = (_event, text: string, reason: string) => {
        setInputValue(text);
        if (reason === "input") setSearchText(text.trim());
    };

    return (
        <Autocomplete
            size="small"
            value={value}
            inputValue={inputValue}
            options={value && !options.length ? [value] : options}
            loading={loading}
            filterOptions={(list) => list}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, selected) => option.id === selected.id}
            onChange={(_event, option) => onChange(option)}
            onInputChange={handleInputChange}
            noOptionsText={t("repository:noOptions")}
            data-cy={dataCy}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={placeholder}
                    sx={{ backgroundColor: colors.white }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress size={16} />}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default AsyncOptionFilter;
