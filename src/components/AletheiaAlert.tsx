import { Alert } from "antd";
import React from "react";

const AletheiaAlert = ({
    type,
    message,
    description = null,
    action = null,
    showIcon = false,
}) => {
    return (
        <Alert
            type={type}
            style={{
                marginBottom: "15px",
                padding: "50px 25px 50px 25px",
            }}
            message={message}
            description={description && description}
            action={action && action}
            showIcon={showIcon}
        />
    );
};

export default AletheiaAlert;
