import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { useEffect, useCallback, useState, useRef } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import { Roles } from "../../types/enums";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { currentUserRole } from "../../atoms/currentUser";

const StyledSelect = styled(Autocomplete)`
    .MuiOutlinedInput-root {
        border-radius: 0px;
    }

    .MuiInputLabel-root {
        color: ${colors.neutralSecondary};
        }
`;

function SelectOptions({
    fieldName = "",
    fetchOptions,
    isMultiple,
    style,
    value,
    preloadedOptions = [],
    preloadedTopics = [],
    loading = false,
    onChange,
    placeholder,
    ...props
}) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState(preloadedOptions);
    const [role] = useAtom(currentUserRole);
    const [nameSpace] = useAtom(currentNameSpace);

    const { t } = useTranslation();

    const debounceTimeout = useRef(null);

    const filteredOptions = options.filter((options) => {
        if (!options?.value) return true;
        const slug = options.value.toLowerCase().replace(" ", "-");

        return !preloadedTopics?.includes(slug || options.value);
    });

    const executeFetch = useCallback(async (inputValue = "") => {
        setFetching(true);
        const canAssignUsers = !(
            fieldName === "usersId" && role === Roles.FactChecker
        );
        const filterOutRoles =
            fieldName === "reviewerId"
                ? [Roles.Regular, Roles.FactChecker]
                : [Roles.Regular];

        try {
            const newOptions = await fetchOptions(
                inputValue,
                t,
                nameSpace,
                filterOutRoles,
                canAssignUsers
            );

            setOptions(newOptions || []);
        } catch (error) {
            console.error(error);
        } finally {
            setFetching(false);
        }
    }, [fetchOptions, fieldName, nameSpace, t, role]);

    const debouncedLoad = useCallback((inputValue) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!inputValue) {
            executeFetch("");
            return;
        }

        debounceTimeout.current = setTimeout(() => {
            executeFetch(inputValue);
        }, 800);
    }, [executeFetch]);

    useEffect(() => {
        executeFetch("");

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [executeFetch]);

    return (
        <StyledSelect
            multiple={isMultiple}
            options={filteredOptions}
            getOptionLabel={(option) => option?.label || ""}
            isOptionEqualToValue={(option, value) =>
                option?.value === value?.value
            }
            loading={fetching || loading}
            value={isMultiple ? (value || []) : (value || null)}
            onChange={(_event, newValue) => {
                if (Array.isArray(newValue)) {
                    onChange(newValue.map(item => item?.value), newValue);
                } else {
                    onChange(newValue?.value, newValue);
                }
            }}
            onInputChange={(_event, newInputValue, reason) => {
                if (reason === "input" || reason === "clear") {
                    debouncedLoad(newInputValue);
                }
            }}
            style={{ ...style }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={placeholder}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: <>{params.InputProps.endAdornment}</>,
                    }}
                />
            )}
            {...props}
        />
    );
}

export default SelectOptions;
