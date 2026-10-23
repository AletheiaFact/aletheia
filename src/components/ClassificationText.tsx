import ReviewColors from "../constants/reviewColors";
import React from "react";
import colors from "../styles/colors";
import { useClassificationLabel } from "../hooks/useClassificationMethodology";

const ClassificationText = (props: {
    classification: string;
    methodology?: string;
    style?: object;
}) => {
    const label = useClassificationLabel(
        props.classification,
        props.methodology
    );

    return (
        <span
            style={{
                color: ReviewColors[props.classification] || colors.black,
                fontWeight: "bold",
                textTransform: "uppercase",
                ...props.style,
            }}
            data-cy={props.classification}
        >
            {label}{" "}
        </span>
    );
};

export default ClassificationText;
