import React, { useState } from "react";
import {
    FormControl,
    Autocomplete,
    TextField,
    CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import TopicsApi from "../../api/topicsApi";
import { useTranslation } from "react-i18next";

const MultiSelectAutocomplete = ({
    isMultiple = true,
    onChange,
    isLoading,
    placeholder,
    setInputValue,
    setIsLoading,
}) => {
    const { t } = useTranslation();
    const [options, setOptions] = useState([]);
    const dispatch = useDispatch();
    let timeout: NodeJS.Timeout;

    const fetchFromApi = async (topic: string, t: any, dispatch: any) => {
        const topicSearchResults = await TopicsApi.getTopics({
            topicName: topic,
            t,
            dispatch,
        });
        return mapTopics(topicSearchResults);
    };

    const mapTopics = (topicSearchResults: any[]) =>
        topicSearchResults?.map(
            ({ name, wikidata, aliases, matchedAlias }) => ({
                label: name,
                value: wikidata,
                aliases: aliases || [],
                matchedAlias: matchedAlias || null,
                displayLabel: matchedAlias ? `${name} (${matchedAlias})` : name,
            })
        ) || [];

    const fetchTopicList = (
        topic: string
    ): Promise<{ label: string; value: string }[]> => {
        return new Promise((resolve) => {
            if (timeout) clearTimeout(timeout);
            if (topic.length >= 3) {
                timeout = setTimeout(async () => {
                    const topics = await fetchFromApi(topic, t, dispatch);
                    resolve(topics);
                }, 1000);
            } else {
                resolve([]);
            }
        });
    };

    const fetchOptions = async (inputValue: string) => {
        if (inputValue.length >= 3) {
            setIsLoading(true);
            const fetchedOptions = await fetchTopicList(inputValue);
            setOptions(fetchedOptions);
            setIsLoading(false);
        } else {
            setOptions([]);
        }
    };

    return (
        <FormControl sx={{ width: "100%" }}>
            <Autocomplete
                freeSolo
                multiple={isMultiple}
                size="small"
                options={options}
                onInputChange={(_, value) => fetchOptions(value)}
                onChange={(_, selectedValues) => {
                    onChange(selectedValues);
                    setInputValue(selectedValues);
                }}
                getOptionLabel={(option) =>
                    option.displayLabel || option.label || ""
                }
                isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                }
                loading={isLoading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={placeholder}
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
        </FormControl>
    );
};

export default MultiSelectAutocomplete;
