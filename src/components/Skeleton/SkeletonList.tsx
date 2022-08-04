import { Row } from "antd";
import React from "react";

const SkeletonList = ({ listItem, repeat }) => {
    const repetitions = Array(repeat);
    console.log(repetitions);
    return (
        <Row gutter={40} style={{ marginTop: 32 }}>
            {[...Array(repeat)].map((_item, index) => (
                <React.Fragment key={index}>{listItem}</React.Fragment>
            ))}
        </Row>
    );
};

export default SkeletonList;
