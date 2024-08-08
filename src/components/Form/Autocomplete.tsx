import React from "react";
import SelectOptions from "./SelectOptions";

interface AutocompleteProps {
    placeholder: string;
    onChange?: any;
    dataCy: string;
    dataLoader: any;
    mode?: string;
    style?: {};
    value?: string | string[];
    preloadedTopics?: string[];
    onSelect?: any;
    onDeselect?: any;
}

const Autocomplete = ({
    placeholder,
    onChange,
    dataCy,
    dataLoader,
    mode = "multiple",
    style = {},
    value = [],
    preloadedTopics = [],
    onSelect = () => {},
    onDeselect = () => {},
}: AutocompleteProps) => {
    return (
        <SelectOptions
            fetchOptions={dataLoader}
            placeholder={placeholder}
            onChange={onChange}
            data-cy={dataCy}
            style={{ width: "100%", ...style }}
            mode={mode}
            value={value}
            preloadedTopics={preloadedTopics}
            onSelect={onSelect}
            onDeselect={onDeselect}
        />
    );
};

export default Autocomplete;
