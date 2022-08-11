import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Layout, Row } from "antd";
import React from "react";

import colors from "../styles/colors";
import AletheiaMenu from "./AletheiaMenu";
import Logo from "./Header/Logo";

const { Sider } = Layout;
const Sidebar = ({ menuCollapsed, onToggleSidebar }) => {
    return (
        <Sider
            collapsible
            defaultCollapsed={menuCollapsed}
            collapsed={menuCollapsed}
            collapsedWidth={0}
            width={270}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                overflow: "hidden",
                zIndex: 4,
                background: "#F5F5F5",
                boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.25)",
            }}
        >
            <Row
                style={{
                    padding: "15px 20px",
                }}
            >
                <Col span={20}>
                    <Logo color="blue" />
                </Col>
                <Col span={4}>
                    <Button
                        data-cy="testSideMenuClosed"
                        onClick={() => onToggleSidebar()}
                        type="text"
                    >
                        <CloseOutlined
                            style={{
                                fontSize: "22px",
                                color: colors.bluePrimary,
                                marginTop: "5px",
                            }}
                        />
                    </Button>
                </Col>
            </Row>
            <AletheiaMenu />
        </Sider>
    );
};

export default Sidebar;
