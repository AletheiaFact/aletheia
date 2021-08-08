import React, { Component } from "react";
import { Progress } from "antd";
import { withTranslation } from "react-i18next";
import ReviewColors from "../../constants/reviewColors";
import StatsReviewColors from "../../constants/statsReviewColors";

class ReviewStats extends Component {
    getStyle(reviewId) {
        const defaultStyle = {
            strokeWidth: this.props.strokeWidth || 18,
            width: this.props.width || 80,
            strokeLinecap: this.props.type === "circle" ? "square" : "round",
            trailColor: "#cccccc"
        };

        return {
            ...defaultStyle,
            strokeColor: StatsReviewColors[reviewId] || "#000"
        };
    }

    render() {
        const { reviews } = this.props?.stats || {};
        const { t } = this.props;
        return (
            <>
                {reviews &&
                    reviews.map(review => {
                        const format =
                            this.props.format === "count"
                                ? () => review.count
                                : null;
                        return (
                            <div
                                className={`stat-${this.props.type}`}
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
                                    {this.props.countInTitle &&
                                        `${review.count} `}
                                    {t(`claimReviewForm:${review._id}`)}
                                </span>
                                <Progress
                                    percent={review.percentage}
                                    type={this.props.type}
                                    format={format}
                                    {...this.getStyle(review._id)}
                                />
                            </div>
                        );
                    })}
            </>
        );
    }
}

export default withTranslation()(ReviewStats);
