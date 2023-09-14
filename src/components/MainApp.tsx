import { Layout } from "antd";
import { useSetAtom } from "jotai";
import React from "react";
import {
    currentAuthentication,
    currentUserId,
    currentUserRole,
    isUserLoggedIn,
} from "../atoms/currentUser";

import { useMediaQueryBreakpoints } from "../hooks/useMediaQueryBreakpoints";
import { useAppSelector } from "../store/store";
import colors from "../styles/colors";
import { GetUserRole } from "../utils/GetUserRole";
import ClaimReviewDrawer from "./ClaimReview/ClaimReviewDrawer";
import ContentWrapper from "./ContentWrapper";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import OverlaySearchResults from "./Search/OverlaySearchResults";
import Sidebar from "./Sidebar";

const MainApp = ({ children }) => {
    const { enableOverlay } = useAppSelector((state) => {
        return {
            enableOverlay: state?.search?.overlayVisible,
        };
    });
    const setCurrentRole = useSetAtom(currentUserRole);
    const setCurrentLoginStatus = useSetAtom(isUserLoggedIn);
    const setCurrentUserId = useSetAtom(currentUserId);
    const setCurrentLevelAuthentication = useSetAtom(currentAuthentication);
    GetUserRole().then(({ role, isLoggedIn, id, aal }) => {
        setCurrentRole(role);
        setCurrentLoginStatus(isLoggedIn);
        setCurrentUserId(id);
        setCurrentLevelAuthentication(aal);
    });

    // Setup to provide breakpoints object on redux
    useMediaQueryBreakpoints();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar />
            <Layout style={{ background: colors.white }}>
                <Header />
                <ContentWrapper>{children}</ContentWrapper>
                <Footer />
                {enableOverlay && <OverlaySearchResults />}
            </Layout>
            <ClaimReviewDrawer />
        </Layout>
    );
};

export default MainApp;
