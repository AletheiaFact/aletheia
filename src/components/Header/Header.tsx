import React from "react";
import { Layout } from "antd";
import HeaderContent from "./HeaderContent";
import colors from "../../styles/colors";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";

const AletheiaHeader = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    return (
        <Layout.Header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                width: "100%",
                backgroundColor:
                    nameSpace === NameSpaceEnum.Main
                        ? colors.bluePrimary
                        : colors.blueSecondary,
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
