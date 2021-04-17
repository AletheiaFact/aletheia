import React, { Component } from "react";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
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
            <header>
                <Row className="aletheia-header">
                    <Col span={2}>
                        <a>
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
                        <p className="aletheia-logo">AletheiaFact</p>
                    </Col>
                    <Col span={2}>
                        <a
                            onClick={() => {
                                this.props.dispatch({
                                    type: "ENABLE_SEARCH_OVERLAY",
                                    overlay: true
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
