import ReviewColors from "../constants/reviewColors";
import React from "react";
import { useTranslation } from "next-i18next";

const ClassificationText = (props: { classification: string }) => {
    const { t } = useTranslation();

    return (
        <span
            style={{
                color: ReviewColors[props.classification] || "#000",
                fontWeight: "bold",
                textTransform: "uppercase"
            }}
        >
            {t(`claimReviewForm:${props.classification}`)}{" "}
        </span>
    );
};

export default ClassificationText
