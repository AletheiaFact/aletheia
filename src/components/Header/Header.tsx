import React from "react";
import { AppBar, useTheme } from "@mui/material";
import HeaderContent from "./HeaderContent";

const AletheiaHeader = () => {
    const theme = useTheme()

    return (
        <AppBar
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                width: "100%",
                background: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.main,
                height: "56px",
                padding: 0,
                minWidth: "265px",
            }}
        >
            <HeaderContent />
        </AppBar>
    );
};

export default AletheiaHeader;
