import React from "react";
import { Button } from "@mui/material";
import { EyeInvisibleFilled, EyeFilled } from "@ant-design/icons";
import colors from "../styles/colors";
import { NameSpaceEnum } from "../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";

const HideContentButton = ({ hide, handleHide, handleUnhide, style = {} }) => {
    const [nameSpace] = useAtom(currentNameSpace);
    const buttonStyle = {
        padding: "5px",
        background: "none",
        border: "none",
        fontSize: 16,
        color:
            nameSpace === NameSpaceEnum.Main
                ? colors.primary
                : colors.secondary,
    };

    return (
        <div style={{ ...style }}>
            {hide ? (
                <Button onClick={handleHide} style={buttonStyle}>
                    <EyeFilled />
                </Button>
            ) : (
                <Button onClick={handleUnhide} style={buttonStyle}>
                    <EyeInvisibleFilled />
                </Button>
            )}
        </div>
    );
};

export default HideContentButton;
