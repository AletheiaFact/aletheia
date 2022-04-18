import React from 'react'
import { Typography } from "antd";

const { Title } = Typography;

const TitlePrivacyPolicy = (props) => {
    return(
        <Title
            level={2} 
            style={{
                fontWeight: 600,
                fontSize: 24,
                lineHeight: 1.35,
            }}
        >
            {props.children}
        </Title>
    )
}

export default TitlePrivacyPolicy
