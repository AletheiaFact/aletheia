import React from "react";
import colors from "../../styles/colors";

const TopicInputErrorMessages = ({ errors }) => {
    const { topics } = errors;

    return (
        <span style={{ color: colors.error, marginTop: 8 }}>
            {topics && topics?.message}
        </span>
    );
};

export default TopicInputErrorMessages;
