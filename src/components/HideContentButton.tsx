import React from "react";
import { Button } from "antd";
import { EyeInvisibleFilled, EyeFilled } from "@ant-design/icons";
import colors from "../styles/colors";

const HideContentButton = ({ hide, handleHide, handleUnhide }) => {
    const buttonStyle = {
        padding: "5px",
        background: "none",
        border: "none",
        fontSize: 16,
        color: colors.bluePrimary,
    };

    return (
        <>
            {hide ? (
                <Button onClick={handleHide} style={buttonStyle}>
                    <EyeFilled />
                </Button>
            ) : (
                <Button onClick={handleUnhide} style={buttonStyle}>
                    <EyeInvisibleFilled />
                </Button>
            )}
        </>
    );
};

export default HideContentButton;
