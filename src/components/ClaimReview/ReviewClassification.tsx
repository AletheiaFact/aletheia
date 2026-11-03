import React from "react";
import ClassificationText from "../ClassificationText";
import MethodologyDisclaimer from "./MethodologyDisclaimer";

interface ReviewClassificationProps {
    label?: string;
    classification: string;
    methodology?: string;
    classificationTextStyle?: React.CSSProperties;
}

const ReviewClassification = ({
    label,
    classification,
    methodology,
    classificationTextStyle = {},
}: ReviewClassificationProps) => {
    return (
        <span>
            {label}
            <ClassificationText
                classification={classification}
                methodology={methodology}
                style={classificationTextStyle}
            />
            <MethodologyDisclaimer methodology={methodology} />
        </span>
    );
};

export default ReviewClassification;
