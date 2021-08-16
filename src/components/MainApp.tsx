import {Layout, Row} from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header/Header";
import BackButton from "./BackButton";
import SearchOverlay from "./SearchOverlay";
import React from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "next-i18next";
import styled from "styled-components"

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

const MainApp = ({children, props}) => {
    const { t } = useTranslation();
    const { enableOverlay, menuCollapsed, isLoggedIn } = mapStateToProps();
    return <Layout style={{ minHeight: "100vh" }}>
        {/* Note that the path doesn't include "public" */}
        <Sidebar
            menuCollapsed={menuCollapsed}
            onToggleSidebar={() => {
                props.dispatch({
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

export default MainApp;
