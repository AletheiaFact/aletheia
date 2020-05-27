import React, { Component } from "react";
import { connect } from "react-redux";
import "./AletheiaHeader.css";
import { Row, Col } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import InputSearch from "../Form/InputSearch";
import api from "../../api/personality";

class AletheiaHeader extends Component {
    handleInputSearch(name) {
        this.props.dispatch({
            type: "SET_SEARCH_NAME",
            searchName: name
        });

        api.getPersonalities(this.props, this.props.dispatch);
    }

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
                            <InputSearch
                                callback={this.handleInputSearch.bind(this)}
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

const mapStateToProps = state => {
    return {
        page: (state && state.searchCurPage) || 1,
        pageSize: (state && state.searchPageSize) || 10,
        searchName: (state && state.searchInput) || null
    };
};

export default connect(mapStateToProps)(AletheiaHeader);
