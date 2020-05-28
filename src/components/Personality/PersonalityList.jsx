import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import api from "../../api/personality";
import { Card, Row, Col, Pagination } from "antd";
import "./PersonalityList.css";
import AffixButton from "../Form/AffixButton";

const { Meta } = Card;

class PersonalityList extends Component {
    constructor(props) {
        super(props);
        this.createPersonality = this.createPersonality.bind(this);
    }

    componentDidMount() {
        api.getPersonalities(this.props, this.props.dispatch);
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

        api.getPersonalities(this.props, this.props.dispatch);
    }

    render() {
        const { personalities } = this.props;

        return (
            <>
                <Row id="card" gutter="16   ">
                    {personalities ? (
                        <>
                            {personalities.map((p, i) => (
                                <Col span={8} key={i}>
                                    <Link to={`personality/${p._id}`}>
                                        <Card
                                            hoverable
                                            style={{
                                                width: "100%",
                                                margin: "8px 0"
                                            }}
                                        >
                                            <Meta
                                                title={p.name}
                                                description={p.description}
                                            />
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </>
                    ) : (
                        <span>No results found</span>
                    )}
                </Row>
                <Row id="pagination">
                    <Col span={24}>
                        <Pagination
                            total={this.props.totalPages * this.props.pageSize}
                            pageSize={this.props.pageSize}
                            onChange={this.handlePagination.bind(this)}
                            current={this.props.page}
                        />
                    </Col>
                </Row>
                <AffixButton createClaim={this.createPersonality} />
            </>
        );
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
export default connect(mapStateToProps)(PersonalityList);
