import React from "react";
import { Layout } from "antd";
import HeaderContent from "./HeaderContent";
import colors from "../../styles/colors";

const AletheiaHeader = () => {
    return (
        <Layout.Header
            style={{
                backgroundColor: colors.bluePrimary,
                height: "70px",
                padding: 0,
            }}
        >
            <HeaderContent />
        </Layout.Header>
    );
};

export default AletheiaHeader;
