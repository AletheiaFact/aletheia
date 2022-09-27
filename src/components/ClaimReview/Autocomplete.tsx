import React from "react";
import SelectOptions from "./form/SelectOptions";

interface AutocompleteProps {
    placeholder: string;
    onChange: any;
    dataCy: string;
    dataLoader: any;
    mode?: string;
    style?: {};
    value?: string | string[];
}

const Autocomplete = ({
    placeholder,
    onChange,
    dataCy,
    dataLoader,
    mode = "multiple",
    style = {},
    value = [],
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
        />
    );
};

export default Autocomplete;
