import React from "react";
import SelectOptions from "./form/SelectOptions";

const Autocomplete = ({
    placeholder,
    onChange,
    dataCy,
    dataLoader,
    mode = "multiple",
}) => {
    return (
        <SelectOptions
            fetchOptions={dataLoader}
            placeholder={placeholder}
            onChange={onChange}
            data-cy={dataCy}
            style={{ width: "100%" }}
            mode={mode}
        />
    );
};

export default Autocomplete;
