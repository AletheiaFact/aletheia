import React, { Component } from "react";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

import api from "../../api/personality";
import InputSearch from "../Form/InputSearch";
import "./AletheiaHeader.less";

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
            <header className="aletheia-header">
                <nav>
                    <Row>
                        <Col flex={1}>
                            <p className="aletheia-logo">Aletheia</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <MenuOutlined
                                style={{
                                    fontSize: "16px",
                                    color: "white",
                                    padding: "8px"
                                }}
                            />
                        </Col>
                        <Col flex={1}>
                            {search && (
                                <InputSearch
                                    placeholder={t("header:search_personality")}
                                    callback={this.handleInputSearch.bind(this)}
                                />
                            )}
                        </Col>
                        <Col>
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
        page: state?.search?.searchCurPage || 1,
        pageSize: state?.search?.searchPageSize || 10,
        searchName: state?.search?.searchInput || null
    };
};

export default connect(mapStateToProps)(withTranslation()(AletheiaHeader));
