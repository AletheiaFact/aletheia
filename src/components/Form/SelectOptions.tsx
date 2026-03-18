import { Autocomplete, TextField } from "@mui/material";

import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import Loading from "../Loading";
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
    ...props
}) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState(preloadedOptions);
    const [selectedValue, setSelectedValue] = useState(value || []);

    const filteredOptions = options.filter(({ value }) => {
        const slug = value.toLowerCase().replace(" ", "-");
        return !props?.preloadedTopics?.includes(slug || value);
    });
    const [role] = useAtom(currentUserRole);
    const [nameSpace] = useAtom(currentNameSpace);

    const { t } = useTranslation();

    const getOptions = useMemo(() => {
        return (value: string) => {
            setOptions([]);
            setFetching(true);
            const canAssignUsers = !(
                fieldName === "usersId" && role === Roles.FactChecker
            );
            const filterOutRoles =
                fieldName === "reviewerId"
                    ? [Roles.Regular, Roles.FactChecker]
                    : [Roles.Regular];

            fetchOptions(
                value,
                t,
                nameSpace,
                filterOutRoles,
                canAssignUsers
            ).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };
    }, [fetchOptions, fieldName, nameSpace, t]);

    return (
        <StyledSelect
            multiple={isMultiple}
            options={filteredOptions}
            getOptionLabel={(option) => option.label || ""}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            loading={fetching}
            value={isMultiple ? value || [] : selectedValue}
            onChange={(_event, newValue) => {
                setSelectedValue(newValue);
                if (Array.isArray(newValue)) {
                    const selectedIds = newValue.map(item => item?.value);
                    onChange(selectedIds);
                } else {
                    onChange(newValue?.value);
                }
            }}
            onInputChange={(event, newInputValue, reason) => {
                getOptions(newInputValue);
            }}
            style={{ ...style }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.placeholder}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            {...props}
        />
    );
}

export default SelectOptions;
