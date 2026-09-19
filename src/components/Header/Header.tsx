import React from "react";
import { AppBar, useTheme } from "@mui/material";
import HeaderContent from "./HeaderContent";
import { useAppSelector } from "../../store/store";

const AletheiaHeader = () => {
    const theme = useTheme()
    const { vw } = useAppSelector((state) => state);

    return (
        <AppBar
            style={{
                position: "sticky",
                top: 0,
                zIndex: vw?.md ? theme.zIndex.modal + 1 : 1000,
                width: "100%",
                background: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.main,
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
