import React from "react";
import colors from "../styles/colors";
import { Typography } from "antd";

const { Title } = Typography;

const SectionTitle = (props) => {
    return (
        <Title
            level={2}
            style={{
                fontSize: "22px",
                lineHeight: "32px",
                margin: "0 0 16px 0",
                fontWeight: 400,
                color: colors.grayPrimary,
            }}
        >
            {props.children}
        </Title>
    );
};

export default SectionTitle;
