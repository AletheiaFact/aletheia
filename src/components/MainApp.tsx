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

const { Footer, Content } = Layout;

const mapStateToProps = () => {
    return useSelector(
        (state) => {
            return {
                isLoggedIn: state?.login || false,
                enableOverlay: state?.search?.overlay,
                menuCollapsed: state?.menuCollapsed !== undefined ? state?.menuCollapsed : true,
            }
        }
    );
};

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
    const { enableOverlay, menuCollapsed, isLoggedIn } = mapStateToProps();
    // TODO: when we are ready to flip the switch and publish the app, remove this check
    if (router.pathname === "/home") {
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
            <Layout>
                <Header />
                <ContentStyled>
                    <Row style={{ padding: "0 30px", marginTop: "10px" }}>
                        <BackButton />
                    </Row>
                    {children}
                </ContentStyled>
                <Footer style={{ textAlign: "center" }}>
                    {t("footer:copyright")}
                </Footer>
                {enableOverlay && <SearchOverlay overlay={enableOverlay} />}
            </Layout>
        </Layout>
    }
};

export default MainApp;
