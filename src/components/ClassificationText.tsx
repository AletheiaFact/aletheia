import ReviewColors from "../constants/reviewColors";
import React from "react";
import colors from "../styles/colors";
import { useTranslations } from "next-intl";

const ClassificationText = (props: {
    classification: string;
    style?: object;
}) => {
    const tClaimReviewForm = useTranslations("claimReviewForm");

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
            {tClaimReviewForm(`${props.classification}`)}{" "}
        </span>
    );
};

export default ClassificationText;
