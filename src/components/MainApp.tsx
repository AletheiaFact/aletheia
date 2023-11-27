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

const MainApp = ({ children }) => {
    const { enableOverlay } = useAppSelector((state) => {
        return {
            enableOverlay: state?.search?.overlayVisible,
        };
    });

    // Setup to provide breakpoints object on redux
    useMediaQueryBreakpoints();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar />
            <Layout style={{ background: colors.white }}>
                <Header />
                <AffixCTAButton />
                <ContentWrapper>{children}</ContentWrapper>
                <Footer />
                {enableOverlay && <OverlaySearchResults />}
            </Layout>
            <ClaimReviewDrawer />
        </Layout>
    );
};

export default MainApp;
