import { Layout } from "antd";
import React from "react";

import { useMediaQueryBreakpoints } from "../hooks/useMediaQueryBreakpoints";
import { useAppSelector } from "../store/store";
import colors from "../styles/colors";
import ClaimReviewDrawer from "./ClaimReview/ClaimReviewDrawer";
import ContentWrapper from "./ContentWrapper";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import OverlaySearchResults from "./Search/OverlaySearchResults";
import Sidebar from "./Sidebar";
import AffixCTAButton from "./AffixButton/AffixCTAButton";
import localConfig from "../../config/localConfig";

const copilotDrawerWidth = 350;

const MainApp = ({ children }) => {
    const { vw, enableOverlay, copilotDrawerCollapsed } = useAppSelector(
        (state) => ({
            vw: state?.vw,
            enableOverlay: state?.search?.overlayVisible,
            copilotDrawerCollapsed:
                state?.copilotDrawerCollapsed !== undefined
                    ? state?.copilotDrawerCollapsed
                    : true,
        })
    );

    // Setup to provide breakpoints object on redux
    useMediaQueryBreakpoints();

    return (
        <Layout
            style={{
                minHeight: "100vh",
                width:
                    copilotDrawerCollapsed || vw?.md
                        ? "100%"
                        : `calc(100% - ${copilotDrawerWidth}px)`,
            }}
        >
            <Sidebar />
            <Layout style={{ background: colors.white }}>
                <Header />
                {localConfig.home.affixCTA ? <AffixCTAButton copilotDrawerWidth={copilotDrawerWidth} /> : null}
                <ContentWrapper>{children}</ContentWrapper>
                <Footer />
                {enableOverlay && <OverlaySearchResults />}
            </Layout>
            <ClaimReviewDrawer />
        </Layout>
    );
};

export default MainApp;
