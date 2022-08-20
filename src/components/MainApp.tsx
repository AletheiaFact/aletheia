import { Layout } from "antd";
import React from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../store/store";
import colors from "../styles/colors";
import ContentWrapper from "./ContentWrapper";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import SearchOverlay from "./SearchOverlay";
import Sidebar from "./Sidebar";

const MainApp = ({ children }) => {
    const dispatch = useDispatch();

    const { enableOverlay, menuCollapsed } = useAppSelector((state) => {
        return {
            isLoggedIn: state?.login || false,
            enableOverlay: state?.search?.overlay,
            menuCollapsed:
                state?.menuCollapsed !== undefined
                    ? state?.menuCollapsed
                    : true,
        };
    });
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar
                menuCollapsed={menuCollapsed}
                onToggleSidebar={() => {
                    dispatch({
                        type: "TOGGLE_MENU",
                        menuCollapsed: !menuCollapsed,
                    });
                }}
            />
            <Layout style={{ background: colors.white }}>
                <Header />
                <ContentWrapper>{children}</ContentWrapper>
                <Footer />

                {enableOverlay && <SearchOverlay overlay={enableOverlay} />}
            </Layout>
        </Layout>
    );
};

export default MainApp;
