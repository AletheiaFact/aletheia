import React, { useLayoutEffect, useState } from "react";
import { Layout } from "antd";
import HeaderContent from "./HeaderContent";
import colors from "../../styles/colors";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";

const AletheiaHeader = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    const [headerBackgroundColor, setHeaderBackgroundColor] = useState(
        colors.bluePrimary
    );
    useLayoutEffect(() => {
        setHeaderBackgroundColor(
            nameSpace === NameSpaceEnum.Main
                ? colors.bluePrimary
                : colors.blueSecondary
        );
    }, [nameSpace]);

    return (
        <Layout.Header
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
        </Layout.Header>
    );
};

export default AletheiaHeader;
