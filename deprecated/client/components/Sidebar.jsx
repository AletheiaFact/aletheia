import React, { Component } from "react";
import { Col, Layout, Row } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import AletheiaMenu from "./AletheiaMenu";

const { Sider } = Layout;

class Sidebar extends Component {
    render() {
        return (
            <Sider
                collapsible
                defaultCollapsed={this.props.menuCollapsed}
                collapsed={this.props.menuCollapsed}
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
                    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.25)"
                }}
            >
                <Row
                    style={{
                        fontSize: "26px",
                        lineHeight: "39px",
                        textAlign: "center",
                        color: "#111111",
                        padding: "15px 20px"
                    }}
                >
                    <Col span={20}>
                        <p>AletheiaFact</p>
                    </Col>
                    <Col span={4}>
                        <a onClick={this.props.onToggleSidebar}>
                            <MenuOutlined
                                style={{
                                    fontSize: "22px",
                                    color: "#B1C2CD",
                                    padding: "8px"
                                }}
                            />
                        </a>
                    </Col>
                </Row>
                <AletheiaMenu />
            </Sider>
        );
    }
}

export default Sidebar;
