import React from "react";
import { Layout } from "antd";
import HeaderContent from "./HeaderContent";

const AletheiaHeader = () => {
        return (
            <Layout.Header
                style={{
                    padding: "0",
                    marginBottom: "6px"
                }}
            >
                <HeaderContent className="aletheia-header" />
            </Layout.Header>
        );
    }

export default AletheiaHeader
