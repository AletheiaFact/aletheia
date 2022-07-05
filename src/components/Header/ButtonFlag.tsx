import React from "react";
import { Button } from "antd";

const ButtonFlag = ({ children, language }) => {
    const setDefaultLanguage = (language) => {
        if(!document.cookie.includes(`default_language=${language}`)) {
            window.location.reload()
        }
        document.cookie = `default_language=${language}`
    }

    return (
        <Button
            style={{
                padding: 0,
                border: "none",
                background: "none"
            }}
            onClick={() => setDefaultLanguage(language)}
        >
            {children}
        </Button>
    )
}

export default ButtonFlag;
