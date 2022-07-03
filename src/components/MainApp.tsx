import { Layout, Row } from "antd";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../store/store";
import colors from "../styles/colors";
import AletheiaSocialMediaFooter from "./AletheiaSocialMediaFooter";
import ContentWrapper from "./ContentWrapper";
import Header from "./Header/Header";
import SearchOverlay from "./SearchOverlay";
import Sidebar from "./Sidebar";

const { Footer } = Layout;

const MainApp = ({ children }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const router = useRouter();

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
    // TODO: when we are ready to flip the switch and publish the app, remove this check
    if (router.pathname === "/landing-page") {
        return <>{children}</>;
    } else {
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

                    <Footer
                        style={{
                            textAlign: "center",
                            background: colors.lightGraySecondary,
                            color: colors.grayTertiary,
                        }}
                    >
                        <AletheiaSocialMediaFooter />
                        <Row
                            style={{
                                marginTop: "10px",
                                width: "100%",
                            }}
                        >
                            <a
                                style={{ width: "100%" }}
                                rel="license"
                                href="https://creativecommons.org/licenses/by-sa/4.0/"
                            >
                                <Image
                                    height={31}
                                    width={88}
                                    alt="Creative Commons License"
                                    style={{ borderWidth: 0 }}
                                    src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
                                />
                            </a>
                        </Row>
                        <Row
                            style={{
                                marginTop: "10px",
                                width: "100%",
                                textAlign: "center",
                                flexDirection: "column",
                                fontSize: "12px",
                            }}
                        >
                            {t("footer:creativeCommons")}
                            <a
                                style={{ whiteSpace: "pre-wrap" }}
                                rel="license"
                                href="https://creativecommons.org/licenses/by-sa/4.0/"
                            >
                                Creative Commons Attribution-ShareAlike 4.0
                                International License
                            </a>
                        </Row>
                        <Row
                            style={{
                                width: "100%",
                                textAlign: "center",
                                marginTop: "10px",
                                flexDirection: "column",
                            }}
                        >
                            {t("footer:copyright")}
                        </Row>
                    </Footer>
                    {enableOverlay && <SearchOverlay overlay={enableOverlay} />}
                </Layout>
            </Layout>
        );
    }
};

export default MainApp;
