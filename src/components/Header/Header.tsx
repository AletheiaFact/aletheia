import React from "react";
import { Layout } from "antd";
import HeaderContent from "./HeaderContent";
import colors from "../../styles/colors";

const AletheiaHeader = () => {
    return (
        <Layout.Header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                width: "100%",
                backgroundColor: colors.bluePrimary,
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
