import React, { useLayoutEffect, useState } from "react";
import { AppBar } from "@mui/material";
import HeaderContent from "./HeaderContent";
import colors from "../../styles/colors";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";

const AletheiaHeader = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    const [headerBackgroundColor, setHeaderBackgroundColor] = useState(
        colors.primary
    );
    useLayoutEffect(() => {
        setHeaderBackgroundColor(
            nameSpace === NameSpaceEnum.Main ? colors.primary : colors.secondary
        );
    }, [nameSpace]);

    return (
        <AppBar
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                width: "100%",
                background: headerBackgroundColor,
                backgroundColor: headerBackgroundColor,
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
