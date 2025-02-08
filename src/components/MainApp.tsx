import { Box } from "@mui/material";
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
import DonationBanner from "./Home/DonationBanner";
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

    const renderCTAButton = () =>
        localConfig.home.affixCTA ? (
            <AffixCTAButton copilotDrawerWidth={copilotDrawerWidth} />
        ) : null;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width:
                    copilotDrawerCollapsed || vw?.md
                        ? "100%"
                        : `calc(100% - ${copilotDrawerWidth}px)`,
            }}
        >
            <Sidebar />
            <Box sx={{ background: colors.white }}>
                <Header />
                <DonationBanner />
                {renderCTAButton()}
                <ContentWrapper>{children}</ContentWrapper>
                <Footer />
                {enableOverlay && <OverlaySearchResults />}
            </Box>
            <ClaimReviewDrawer />
        </Box>
    );
};

export default MainApp;
