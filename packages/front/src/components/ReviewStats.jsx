import React, { Component, useRef } from "react";

import { Statistic, Tooltip } from "antd";

import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    QuestionCircleOutlined,
    MinusCircleOutlined,
    MonitorOutlined,
    DotChartOutlined,
    CloseSquareOutlined,
    SoundOutlined
} from "@ant-design/icons";

class ReviewStats extends Component {
    getIcon(reviewId) {
        switch (reviewId) {
            case "not-fact":
                return <MinusCircleOutlined />;
            case "true":
                return <CheckCircleOutlined />;
            case "true-but":
                return <MonitorOutlined />;
            case "arguable":
                return <DotChartOutlined />;
            case "misleading":
                return <ExclamationCircleOutlined />;
            case "false":
                return <CloseCircleOutlined />;
            case "unsustainable":
                return <CloseSquareOutlined />;
            case "exaggerated":
                return <SoundOutlined />;
            case "unverifiable":
                return <QuestionCircleOutlined />;

            default:
                break;
        }
    }

    render() {
        return (
            <>
                {this.props.dataSource.map(review => {
                    const percentage =
                        Math.floor(review.percentage * 100) / 100;
                    return (
                        <Tooltip
                            placement="left"
                            title={review._id}
                            key={review._id}
                        >
                            <span>
                                {" "}
                                <Statistic
                                    value={percentage}
                                    suffix="%"
                                    prefix={this.getIcon(review._id)}
                                />
                            </span>
                        </Tooltip>
                    );
                })}
            </>
        );
    }
}

export default ReviewStats;
