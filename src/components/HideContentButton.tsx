import React from "react";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
                <IconButton onClick={handleHide} style={buttonStyle}>
                    <Visibility fontSize="small"/>
                </IconButton>
            ) : (
                <IconButton onClick={handleUnhide} style={buttonStyle}>
                    <VisibilityOff fontSize="small" />
                </IconButton>
            )}
        </div>
    );
};

export default HideContentButton;
