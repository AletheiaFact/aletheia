import React from 'react'
import { Typography } from "antd";

const { Title } = Typography;

const Subtitle = (props) => {
    return(
        <Title
            level={2} 
            style={{
                fontWeight: 600,
                fontSize: 24,
                lineHeight: 1.35,
                ...props.style
            }}
        >
            {props.children}
        </Title>
    )
}

export default Subtitle
