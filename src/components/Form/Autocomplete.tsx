import React, { useEffect, useState } from "react";
import SelectOptions from "./SelectOptions";
import userApi from "../../api/userApi";
import { AutoCompleteType } from "./FormField";

interface AutocompleteProps {
    placeholder: string;
    onChange: any;
    dataCy: string;
    dataLoader: any;
    type: AutoCompleteType;
    mode?: string;
    style?: {};
    value?: string[] | any;
    preloadedOptions?: string[];
}

const Autocomplete = ({
    placeholder,
    onChange,
    dataCy,
    dataLoader,
    type,
    mode = "multiple",
    style = {},
    value = [],
    preloadedOptions = [],
}: AutocompleteProps) => {
    const [treatedValue, setTreatedValue] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserNames = async () => {
            if (
                type === AutoCompleteType.INPUT_SEARCH &&
                (Array.isArray(value) ? value.length > 0 : value !== "")
            ) {
                try {
                    setIsLoading(true);
                    const userPromises = Array.isArray(value)
                        ? value.map((id) => userApi.getById(id))
                        : [userApi.getById(value)];
                    const users = await Promise.all(userPromises);
                    const treatedValues = users.map((user) => ({
                        label: user.name,
                        value: user._id,
                    }));
                    setTreatedValue(treatedValues);
                } catch (error) {
                    console.error(error);
                    setTreatedValue(value);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setTreatedValue(value);
            }
        };

        fetchUserNames();
    }, [value, type]);

    return (
        <SelectOptions
            fetchOptions={dataLoader}
            placeholder={placeholder}
            onChange={onChange}
            data-cy={dataCy}
            style={{ width: "100%", ...style }}
            mode={mode}
            value={treatedValue}
            preloadedOptions={preloadedOptions}
            loading={isLoading}
        />
    );
};

export default Autocomplete;
