import React, { Component } from "react";
import { Progress } from "antd";
import {
    CheckCircleFilled,
    CloseCircleFilled,
    CloseSquareFilled,
    DotChartOutlined,
    ExclamationCircleFilled,
    MinusCircleFilled,
    MonitorOutlined,
    QuestionCircleFilled,
    SoundOutlined
} from "@ant-design/icons";
import { withTranslation } from "react-i18next";

class ClaimMetrics extends Component {
    getStyle(reviewId) {
        const defaultStyle = {
            strokeWidth: this.props.strokeWidth || 18,
            width: this.props.width || 80,
            strokeLinecap: this.props.type === "circle" ? "square" : "round",
            trailColor: "#cccccc"
        };
        switch (reviewId) {
            case "not-fact":
                return {
                    ...defaultStyle,
                    strokeColor: "#111"
                };
            case "true":
                return {
                    ...defaultStyle,
                    strokeColor: "#4dc24d"
                };
            case "true-but":
                return {
                    ...defaultStyle,
                    strokeColor: "#57e173"
                };
            case "arguable":
                return {
                    ...defaultStyle,
                    strokeColor: "#d8d12f"
                };
            case "misleading":
                return {
                    ...defaultStyle,
                    strokeColor: "#d35730"
                };
            case "false":
                return {
                    ...defaultStyle,
                    strokeColor: "#d33730"
                };
            case "unsustainable":
                return {
                    ...defaultStyle,
                    strokeColor: "#d7425e"
                };
            case "exaggerated":
                return {
                    ...defaultStyle,
                    strokeColor: "#c1d259"
                };
            case "unverifiable":
                return {
                    ...defaultStyle,
                    strokeColor: "#d89d2f"
                };

            default:
                break;
        }
    }

    render() {
        const { reviews } = this.props.stats;
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
                            <div className={`stat-${this.props.type}`}>
                                <span>
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

export default withTranslation()(ClaimMetrics);
