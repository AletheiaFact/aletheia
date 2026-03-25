import React from "react";
import { AppBar, } from "@mui/material";
import HeaderContent from "./HeaderContent";
import colors from "../../styles/colors";

const AletheiaHeader = () => {
    return (
        <AppBar
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                width: "100%",
                background: `${colors.primary}`,
                backgroundColor: `${colors.primary}`,
                height: "64px",
                padding: 0,
                minWidth: "265px",
            }}
        >
            <HeaderContent />
        </AppBar>
    );
};

export default AletheiaHeader;
