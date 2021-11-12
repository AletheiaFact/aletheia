import {Layout, Row} from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header/Header";
import BackButton from "./BackButton";
import SearchOverlay from "./SearchOverlay";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "next-i18next";
import styled from "styled-components"
import { useRouter } from 'next/router'
import colors from "../styles/colors";

const { Footer, Content } = Layout;

const ContentStyled = styled(Content)`
    padding: 0 15px;

    @media (min-width: 768px) {
        padding: 0 30%;
    }
`;

const MainApp = ({children}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const router = useRouter();
    const { enableOverlay, menuCollapsed, isLoggedIn } = useSelector(
        (state) => {
            return {
                isLoggedIn: state?.login || false,
                enableOverlay: state?.search?.overlay,
                menuCollapsed: state?.menuCollapsed !== undefined ? state?.menuCollapsed : true,
            }
        }
    );
    // TODO: when we are ready to flip the switch and publish the app, remove this check
    if (router.pathname === "/landing-page") {
        return <>
            {children}
        </>
    } else {
        return <Layout style={{ minHeight: "100vh" }}>
            <Sidebar
                menuCollapsed={menuCollapsed}
                onToggleSidebar={() => {
                    dispatch({
                        type: "TOGGLE_MENU",
                        menuCollapsed: !menuCollapsed,
                    });
                }}
            />
            <Layout style={{ background: "#FFF" }}>
                <Header />
                <ContentStyled>
                    <Row style={{
                        padding: "10px 30px",
                        background: "#FFFFFF",
                        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.15)",
                        margin: "0px -15px"
                    }}>
                        <BackButton />
                    </Row>
                    {children}
                </ContentStyled>
                <Footer style={{
                    textAlign: "center",
                    background: colors.grayPrimary,
                    color: colors.white
                }}
                >
                    {t("footer:copyright")}
                </Footer>
                {enableOverlay && <SearchOverlay overlay={enableOverlay} />}
            </Layout>
        </Layout>
    }
};

export default MainApp;
