import React, { Component } from "react";
import { connect } from "react-redux";
import "./AletheiaHeader.css";
import { Row, Col } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import InputSearch from "../Form/InputSearch";
import api from "../../api/personality";
import { withTranslation } from "react-i18next";

class AletheiaHeader extends Component {
    handleInputSearch(name) {
        this.props.dispatch({
            type: "SET_SEARCH_NAME",
            searchName: name
        });

        api.getPersonalities(this.props, this.props.dispatch);
    }

    render() {
        const { t } = this.props;
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
                                placeholder={t("header:search_personality")}
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

export default connect(mapStateToProps)(withTranslation()(AletheiaHeader));
