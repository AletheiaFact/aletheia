import React, { Component } from "react";
import "./AletheiaHeader.css";
import { Row, Col, Input } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";

const { Search } = Input;

class AletheiaHeader extends Component {
    render() {
        return (
            <header className="aletheia-header">
                <nav>
                    <Row>
                        <Col span={24}>
                            <span className="aletheia-logo">Aletheia</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={3} span={2}>
                            <MenuOutlined
                                style={{
                                    fontSize: "16px",
                                    color: "white",
                                    padding: "8px"
                                }}
                            />
                        </Col>
                        <Col span={14}>
                            <Search
                                placeholder="Busque uma personalidade"
                                onSearch={value => console.log(value)}
                            />
                        </Col>
                        <Col span={2}>
                            <UserOutlined
                                style={{
                                    fontSize: "16px",
                                    color: "white",
                                    padding: "8px"
                                }}
                            />
                        </Col>
                    </Row>
                </nav>
            </header>
        );
    }
}

export default AletheiaHeader;
