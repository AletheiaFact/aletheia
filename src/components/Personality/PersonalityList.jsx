import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import api from "../../api/personality";
import { Card, Row, Col, Pagination, Spin } from "antd";
import "./PersonalityList.css";
import AffixButton from "../Form/AffixButton";
import { withTranslation } from "react-i18next";
import PersonalityCard from "./PersonalityCard";
import PersonalityCreateCTA from "./PersonalityCreateCTA";

const { Meta } = Card;

class PersonalityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
        this.createPersonality = this.createPersonality.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        api.getPersonalities(this.props, this.props.dispatch).then(() =>
            this.setState({ isLoading: false })
        );
    }

    createPersonality() {
        const path = `./personality/create`;
        this.props.history.push(path);
    }

    handlePagination(page) {
        this.props.dispatch({
            type: "SET_CUR_PAGE",
            page
        });
        this.setState({ isLoading: true });
        api.getPersonalities(
            { ...this.props, page },
            this.props.dispatch
        ).then(() => this.setState({ isLoading: false }));
    }

    render() {
        const { personalities, t } = this.props;
        if (!this.state.isLoading) {
            return (
                <>
                    {personalities &&
                    Array.isArray(personalities) &&
                    personalities.length > 0 ? (
                        <>
                            {personalities.map(
                                (p, i) =>
                                    p && (
                                        <PersonalityCard
                                            personality={p}
                                            summarized={true}
                                            key={p._id}
                                        />
                                    )
                            )}
                            <Row id="pagination">
                                <Col span={24}>
                                    <Pagination
                                        total={
                                            this.props.totalPages *
                                            this.props.pageSize
                                        }
                                        pageSize={this.props.pageSize}
                                        onChange={this.handlePagination.bind(
                                            this
                                        )}
                                        current={this.props.page}
                                    />
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <Row
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            <PersonalityCreateCTA href="personality/search" />
                        </Row>
                    )}
                </>
            );
        } else {
            return (
                <Spin
                    tip={t("global:loading")}
                    style={{
                        textAlign: "center",
                        position: "absolute",
                        top: "50%",
                        left: "calc(50% - 40px)"
                    }}
                ></Spin>
            );
        }
    }
}
const mapStateToProps = state => {
    return {
        personalities: (state && state.searchResults) || [],
        page: (state && state.searchCurPage) || 1,
        pageSize: (state && state.searchPageSize) || 10,
        totalPages: (state && state.searchTotalPages) || 1
    };
};
export default connect(mapStateToProps)(withTranslation()(PersonalityList));
