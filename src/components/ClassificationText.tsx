import ReviewColors from "../constants/reviewColors";
import React from "react";

export default (props) => {
    return (
        <span
            style={{
                color: ReviewColors[props.classification] || "#000",
                fontWeight: "bold",
                textTransform: "uppercase"
            }}
        >
            {props.t(`claimReviewForm:${props.classification}`)}{" "}
        </span>
    );
};
