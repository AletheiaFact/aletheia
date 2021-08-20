import React, { Component } from "react";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Layout, Row } from "antd";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

import api from "../../api/personality";
import "./AletheiaHeader.less";
import { withRouter } from "react-router-dom";

const { Header } = Layout;

class AletheiaHeader extends Component {
    static defaultProps = {
        search: true
    };

    handleInputSearch(name) {
        this.props.dispatch({
            type: "SET_SEARCH_NAME",
            searchName: name
        });

        api.getPersonalities(this.props, this.props.dispatch);
    }

    render() {
        const { t, search } = this.props;
        return (
            <Header
                style={{
                    padding: "0",
                    marginBottom: "6px"
                }}
            >
                <Row className="aletheia-header">
                    <Col span={2}>
                        <a
                            onClick={() => {
                                this.props.dispatch({
                                    type: "TOGGLE_MENU",
                                    menuCollapsed: !this.props.menuCollapsed
                                });
                            }}
                        >
                            <MenuOutlined
                                style={{
                                    fontSize: "16px",
                                    color: "white",
                                    padding: "8px"
                                }}
                            />
                        </a>
                    </Col>
                    <Col span={20}>
                        <a onClick={() => this.props.history.push("/")}>
                            <p className="aletheia-logo">AletheiaFact</p>
                        </a>
                    </Col>
                    <Col span={2}>
                        <a
                            onClick={() => {
                                const pathname = this.props.history.location
                                    .pathname;
                                this.props.dispatch({
                                    type: "ENABLE_SEARCH_OVERLAY",
                                    overlay: {
                                        search: true,
                                        results: pathname !== "/personality"
                                    }
                                });
                            }}
                        >
                            <SearchOutlined
                                style={{
                                    fontSize: "16px",
                                    color: "white",
                                    padding: "8px"
                                }}
                            />
                        </a>
                    </Col>
                </Row>
            </Header>
        );
    }
}

const mapStateToProps = state => {
    return {
        page: state?.search?.searchCurPage || 1,
        pageSize: state?.search?.searchPageSize || 10,
        searchName: state?.search?.searchInput || null,
        menuCollapsed:
            state?.menuCollapsed !== undefined ? state?.menuCollapsed : true
    };
};

export default connect(mapStateToProps)(
    withTranslation()(withRouter(AletheiaHeader))
);
