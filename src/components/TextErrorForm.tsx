import React from "react";
import colors from "../styles/colors";

const TextError = ({ children, stateError, "data-cy": dataCy }) => {
    return (
        <p
            data-cy={dataCy}
            style={{
                fontSize: 14,
                color: colors.error,
                visibility: stateError ? "visible" : "hidden",
                marginBottom: 4,
            }}
        >
            {children}
        </p>
    );
};

export default TextError;
