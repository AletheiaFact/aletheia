import { Layout } from "antd";
import React from "react";
import { useDispatch } from "react-redux";

import { useMediaQueryBreakpoints } from "../hooks/useMediaQueryBreakpoints";
import { useAppSelector } from "../store/store";
import { ActionTypes } from "../store/types";
import colors from "../styles/colors";
import ContentWrapper from "./ContentWrapper";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import OverlaySearchResults from "./Search/OverlaySearchResults";
import Sidebar from "./Sidebar";

const MainApp = ({ children }) => {
    const dispatch = useDispatch();

    const { enableOverlay, menuCollapsed } = useAppSelector((state) => {
        return {
            enableOverlay: state?.search?.overlayVisible,
            menuCollapsed:
                state?.menuCollapsed !== undefined
                    ? state?.menuCollapsed
                    : true,
        };
    });

    // Setup to provide breakpoints object on redux
    useMediaQueryBreakpoints();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar
                menuCollapsed={menuCollapsed}
                onToggleSidebar={() => {
                    dispatch({
                        type: ActionTypes.TOGGLE_MENU,
                        menuCollapsed: !menuCollapsed,
                    });
                }}
            />
            <Layout style={{ background: colors.white }}>
                <Header />
                <ContentWrapper>{children}</ContentWrapper>
                <Footer />
                {enableOverlay && <OverlaySearchResults />}
            </Layout>
        </Layout>
    );
};

export default MainApp;
