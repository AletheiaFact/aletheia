import React from "react";
import { Typography } from "antd";
import colors from "../styles/colors";
const { Text } = Typography;

const Label = ({ children, required = false }) => {
    return (
        <span style={{ color: colors.error }}>
            {required && "* "}
            <Text strong style={{ color: colors.blackSecondary }}>
                {children}
            </Text>
        </span>
    );
};

export default Label;
