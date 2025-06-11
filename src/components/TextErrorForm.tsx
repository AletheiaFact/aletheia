import React from "react";
import colors from "../styles/colors";

const TextError = ({ children, stateError }) => {
    return (
        <p
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
