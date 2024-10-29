import React from "react";
import { Progress, ProgressProps } from "antd";
import ReviewColors from "../../constants/reviewColors";
import colors from "../../styles/colors";
import StatsReviewColors from "../../constants/statsReviewColors";
import { useTranslation } from "next-i18next";

const ReviewProgress = ({ reviews, statsProps }) => {
    const { t } = useTranslation();

    const getStyle = (reviewId) => {
        const defaultStyle: ProgressProps = {
            strokeWidth: statsProps.strokeWidth || 18,
            width: statsProps.width || 80,
            strokeLinecap: statsProps.type === "circle" ? "square" : "round",
            trailColor: colors.neutralTertiary,
        };

        return {
            ...defaultStyle,
            strokeColor: StatsReviewColors[reviewId] || colors.black,
        };
    };

    return reviews.map((review) => {
        const format =
            statsProps.format === "count" ? () => review.count : null;
        return (
            <div
                style={
                    statsProps.type === "circle"
                        ? {
                            display: "flex",
                            flexDirection: "column-reverse",
                            alignItems: "center",
                            paddingRight: "10px",
                        }
                        : {}
                }
                key={review._id}
            >
                <span
                    style={{
                        color: ReviewColors[review._id] || colors.black,
                        fontWeight: "700",
                        textTransform: "uppercase",
                        textAlign: "center",
                        fontSize: "10px",
                        marginTop: "5px",
                    }}
                >
                    {statsProps.countInTitle && `${review.count} `}
                    {t(`claimReviewForm:${review._id}`)}
                </span>
                <Progress
                    percent={review.percentage}
                    type={statsProps.type}
                    format={format}
                    {...getStyle(review._id)}
                />
            </div>
        );
    });
};

export default ReviewProgress;
