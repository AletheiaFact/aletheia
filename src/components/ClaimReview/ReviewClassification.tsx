import React from "react";
import ClassificationText from "../ClassificationText";

interface ReviewClassificationProps {
    label?: string;
    classification: string;
    classificationTextStyle?: React.CSSProperties;
}

const ReviewClassification = ({
    label,
    classification,
    classificationTextStyle = {},
}: ReviewClassificationProps) => {
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
