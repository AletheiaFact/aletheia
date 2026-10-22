import React, { useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useTranslation } from "next-i18next";
import { debounce } from "lodash";
import OrganizationApi from "../../../api/organizationApi";
import { Organization } from "../../../types/Organization";
import { sanitizeUrl } from "../../../utils/ValidateUrl";

const MIN_SEARCH_LENGTH = 2;

interface OrganizationSearchProps {
    /** Organizations already in the list, hidden from the results. */
    excludeIds: string[];
    onSelect: (organization: Organization) => void;
    disabled?: boolean;
    dataCy: string;
}

const OrganizationSearch = ({
    excludeIds,
    onSelect,
    disabled,
    dataCy,
}: OrganizationSearchProps) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const latestQuery = useRef("");

    const search = useMemo(
        () =>
            debounce(async (name: string) => {
                setIsLoading(true);
                const results = await OrganizationApi.search(name, t);
                // Drop responses that arrive after the user typed further.
                if (latestQuery.current === name) {
                    setOptions(results);
                    setIsLoading(false);
                }
            }, 400),
        [t]
    );

    useEffect(() => () => search.cancel(), [search]);

    const handleInputChange = (value: string, reason: string) => {
        setInputValue(value);
        if (reason === "reset") {
            return;
        }
        const query = value.trim();
        latestQuery.current = query;
        if (query.length >= MIN_SEARCH_LENGTH) {
            search(query);
        } else {
            search.cancel();
            setOptions([]);
            setIsLoading(false);
        }
    };

    const isQueryTooShort = inputValue.trim().length < MIN_SEARCH_LENGTH;

    return (
        <Autocomplete
            sx={{ flex: "1 1 260px" }}
            size="small"
            value={null}
            inputValue={inputValue}
            options={options.filter(({ _id }) => !excludeIds.includes(_id))}
            filterOptions={(results) => results}
            getOptionLabel={(organization) => organization.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            loading={isLoading}
            disabled={disabled}
            noOptionsText={t(
                isQueryTooShort
                    ? "events:organizationSearchHint"
                    : "events:organizationSearchEmpty"
            )}
            onInputChange={(_, value, reason) =>
                handleInputChange(value, reason)
            }
            onChange={(_, organization) => {
                if (!organization) return;
                onSelect(organization);
                latestQuery.current = "";
                setInputValue("");
                setOptions([]);
            }}
            renderOption={(props, organization) => (
                <li {...props} key={organization._id}>
                    <img
                        src={sanitizeUrl(organization.logo?.content)}
                        alt=""
                        width={32}
                        height={32}
                        style={{ objectFit: "contain", marginRight: 12 }}
                    />
                    {organization.name}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={t("events:organizationSearchPlaceholder")}
                    inputProps={{
                        ...params.inputProps,
                        "aria-label": t("events:organizationSearchPlaceholder"),
                        "data-cy": `${dataCy}-search`,
                    }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoading && (
                                    <CircularProgress
                                        color="inherit"
                                        size={20}
                                    />
                                )}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default OrganizationSearch;
