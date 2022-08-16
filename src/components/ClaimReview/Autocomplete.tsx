import React from "react";
import SelectOptions from "./form/SelectOptions";

const Autocomplete = ({
    placeholder,
    onChange,
    dataCy,
    dataLoader,
    mode = "multiple",
    style = {},
    value = [],
}) => {
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
