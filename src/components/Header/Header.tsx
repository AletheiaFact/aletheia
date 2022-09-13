import React from "react";
import { Layout } from "antd";
import HeaderContent from "./HeaderContent";
import colors from "../../styles/colors";

const AletheiaHeader = () => {
    return (
        <Layout.Header
            style={{
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
