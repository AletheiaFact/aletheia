import React from "react";
import { Progress } from "antd";
import ReviewColors from "../../constants/reviewColors";
import StatsReviewColors from "../../constants/statsReviewColors";
import { useTranslation } from "next-i18next";

const ReviewStats = (props) => {
    const { reviews } = props?.stats || {};
    const { t } = useTranslation();

    const getStyle = (reviewId) => {
        const defaultStyle = {
            strokeWidth: props.strokeWidth || 18,
            width: props.width || 80,
            strokeLinecap: props.type === "circle" ? "square" : "round",
            trailColor: "#cccccc"
        };

        return {
            ...defaultStyle,
            strokeColor: StatsReviewColors[reviewId] || "#000"
        };
    }

    return (
        <>
            {reviews &&
            reviews.map(review => {
                const format =
                    props.format === "count"
                        ? () => review.count
                        : null;
                return (
                    <div
                        style={props.type === "circle" ? {
                            display: "flex",
                            flexDirection: "column-reverse",
                        } : {}}
                        key={review._id}
                    >
                                <span
                                    style={{
                                        color:
                                            ReviewColors[review._id] || "#000",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        textAlign: "center",
                                        fontSize: "10px",
                                        marginTop: "5px"
                                    }}
                                >
                                    {props.countInTitle &&
                                    `${review.count} `}
                                    {t(`claimReviewForm:${review._id}`)}
                                </span>
                        <Progress
                            percent={review.percentage}
                            type={props.type}
                            format={format}
                            {...getStyle(review._id)}
                        />
                    </div>
                );
            })}
        </>
    );
}

export default ReviewStats;
