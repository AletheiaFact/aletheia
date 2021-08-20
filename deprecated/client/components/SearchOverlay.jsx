import React, { Component } from "react";
import { connect } from "react-redux";
import { Avatar, Col, Row } from "antd";
import { CloseOutlined, RightOutlined } from "@ant-design/icons";
import InputSearch from "./Form/InputSearch";
import { withTranslation } from "react-i18next";
import api from "../api/personality";
import { withRouter } from "react-router-dom";

class SearchOverlay extends Component {
    handleInputSearch(name) {
        this.props.dispatch({
            type: "SET_SEARCH_NAME",
            searchName: name
        });

        api.getPersonalities(this.props, this.props.dispatch);
    }

    render() {
        const { t, personalities } = this.props;
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute"
                }}
            >
                <Row className="aletheia-header">
                    <Col span={20}>
                        <InputSearch
                            placeholder={t("header:search_personality")}
                            callback={this.handleInputSearch.bind(this)}
                        />
                    </Col>
                    <Col
                        span={4}
                        style={{
                            textAlign: "center"
                        }}
                    >
                        <a
                            onClick={() => {
                                this.props.dispatch({
                                    type: "ENABLE_SEARCH_OVERLAY",
                                    overlay: false
                                });
                            }}
                        >
                            <CloseOutlined
                                style={{
                                    fontSize: "16px",
                                    color: "white",
                                    padding: "8px"
                                }}
                            />
                        </a>
                    </Col>
                </Row>
                {this.props.overlay.results && (
                    <Row
                        className="main-content"
                        style={{
                            background: "rgba(255,255,255,0.9)",
                            height: "100vh",
                            zIndex: 3,
                            position: "relative",
                            flexDirection: "column"
                        }}
                    >
                        {personalities &&
                            Array.isArray(personalities) &&
                            personalities.length > 0 && (
                                <>
                                    {personalities.map(
                                        (p, i) =>
                                            p && (
                                                <Row
                                                    key={i}
                                                    style={{
                                                        background: "#fff",
                                                        padding: "10px 10%",
                                                        boxShadow:
                                                            "0 2px 2px rgba(0, 0, 0, 0.1)",
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={() => {
                                                        this.props.dispatch({
                                                            type:
                                                                "ENABLE_SEARCH_OVERLAY",
                                                            overlay: false
                                                        });
                                                        this.props.history.push(
                                                            `/personality/${p._id}`
                                                        );
                                                    }}
                                                >
                                                    <Col span={4}>
                                                        <Avatar
                                                            size={30}
                                                            src={p.image}
                                                        />
                                                    </Col>
                                                    <Col span={18}>
                                                        <span
                                                            level={4}
                                                            style={{
                                                                marginBottom: 0,
                                                                textSize: "14px"
                                                            }}
                                                        >
                                                            {p.name}
                                                        </span>
                                                    </Col>
                                                    <Col span={2}>
                                                        <RightOutlined />
                                                    </Col>
                                                </Row>
                                            )
                                    )}
                                </>
                            )}
                    </Row>
                )}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        personalities: state?.search?.searchResults || [],
        page: state?.search?.searchCurPage || 1,
        pageSize: state?.search?.searchPageSize || 10,
        searchName: state?.search?.searchInput || null
    };
};
export default connect(mapStateToProps)(
    withTranslation()(withRouter(SearchOverlay))
);
