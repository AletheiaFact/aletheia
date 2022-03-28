import React from 'react'
import { Typography } from "antd";
import colors from '../styles/colors';
const { Text } = Typography

const Label: React.FC = ({ children }) => {
    return (
        <Text strong style={{ color: colors.blackSecondary }}>{children}</Text>
    )
}

export default Label
