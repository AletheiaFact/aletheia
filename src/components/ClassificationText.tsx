import ReviewColors from "../constants/reviewColors";
import React from "react";
import { useTranslation } from "next-i18next";

const ClassificationText = (props: {
    classification: string;
    style?: object;
}) => {
    const { t } = useTranslation();

    return (
        <span
            style={{
                color: ReviewColors[props.classification] || "#000",
                fontWeight: "bold",
                textTransform: "uppercase",
                ...props.style,
            }}
            data-cy={props.classification}
        >
            {t(`claimReviewForm:${props.classification}`)}{" "}
        </span>
    );
};

export default ClassificationText;
