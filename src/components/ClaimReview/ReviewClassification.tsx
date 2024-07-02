import React from "react";
import ClassificationText from "../ClassificationText";

const ReviewClassification = ({
    label,
    classification,
    classificationTextStyle = {},
    style = {},
}) => {
    return (
        <span>
            {label}
            <ClassificationText
                classification={classification}
                style={classificationTextStyle}
            />
        </span>
    );
};

export default ReviewClassification;
