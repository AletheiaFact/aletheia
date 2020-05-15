import React, { Component, useRef } from "react";

import { Statistic, Tooltip, Col } from "antd";

import {
    CheckCircleFilled,
    CloseCircleFilled,
    ExclamationCircleFilled,
    QuestionCircleFilled,
    MinusCircleFilled,
    MonitorOutlined,
    DotChartOutlined,
    CloseSquareFilled,
    SoundOutlined
} from "@ant-design/icons";

class ReviewStats extends Component {
    getIcon(reviewId) {
        switch (reviewId) {
            case "not-fact":
                return {
                    valueStyle: { color: "#dddddd" },
                    prefix: <MinusCircleFilled />
                };
            case "true":
                return {
                    valueStyle: { color: "#60b546" },
                    prefix: <CheckCircleFilled />
                };
            case "true-but":
                return {
                    valueStyle: { color: "#9dbaec" },
                    prefix: <MonitorOutlined />
                };
            case "arguable":
                return {
                    valueStyle: { color: "#4123" },
                    prefix: <DotChartOutlined />
                };
            case "misleading":
                return {
                    valueStyle: { color: "#febb39" },
                    prefix: <ExclamationCircleFilled />
                };
            case "false":
                return {
                    valueStyle: { color: "#ec3e37" },
                    prefix: <CloseCircleFilled />
                };
            case "unsustainable":
                return {
                    valueStyle: { color: "#282828" },
                    prefix: <CloseSquareFilled />
                };
            case "exaggerated":
                return {
                    valueStyle: { color: "#f26538" },
                    prefix: <SoundOutlined />
                };
            case "unverifiable":
                return {
                    valueStyle: { color: "#2175fb" },
                    prefix: <QuestionCircleFilled />
                };

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
                            <Col span={1}>
                                {" "}
                                <Statistic
                                    value={percentage}
                                    suffix="%"
                                    {...this.getIcon(review._id)}
                                />
                            </Col>
                            <Col span={1}> </Col>
                        </Tooltip>
                    );
                })}
            </>
        );
    }
}

export default ReviewStats;
