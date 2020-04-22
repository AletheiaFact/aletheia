import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Card, Row, Col, Pagination, Button } from "antd";
import InputSearch from "../Form/InputSearch";
import "./PersonalityList.css";
const { Meta } = Card;

class PersonalityList extends Component {
    constructor(props) {
        super(props);
        this.createPersonality = this.createPersonality.bind(this);
        this.state = {
            personalities: [],
            page: 1,
            searchName: null,
            pageSize: 10,
            totalPages: 1
        };
    }

    componentDidMount() {
        const self = this;
        self.getPersonalities();
    }

    createPersonality() {
        const path = `./personality/create`;
        this.props.history.push(path);
    }
    getPersonalities() {
        const { page, searchName, pageSize } = this.state;
        const params = {
            page: page - 1,
            name: searchName,
            pageSize
        };

        axios
            .get(`${process.env.API_URL}/personality`, { params })
            .then(response => {
                const { personalities, totalPages } = response.data;
                this.setState({
                    personalities,
                    totalPages
                });
            })
            .catch(e => {
                throw e;
            });
    }

    handleInputSearch(name) {
        this.setState({ searchName: name });
        this.getPersonalities();
    }

    handlePagination(page) {
        this.setState({ page }, () => {
            this.getPersonalities();
        });
    }

    render() {
        const { personalities } = this.state;

        return (
            <>
                <h1 id="title" level="2" margin="none">
                    Choose a personality
                </h1>
                <Row id="search">
                    <Col span={24}>
                        <Button
                            onClick={this.createPersonality}
                            type="primary"
                            style={{ marginBottom: 16 }}
                        >
                            Add Claim
                        </Button>
                        <InputSearch
                            callback={this.handleInputSearch.bind(this)}
                        />
                    </Col>
                </Row>
                <Row id="card" gutter="16   ">
                    {personalities ? (
                        <>
                            {personalities.map((p, i) => (
                                <Col span={8}>
                                    <Link to={`personality/${p._id}`}>
                                        <Card
                                            hoverable
                                            style={{
                                                width: "100%",
                                                margin: "8px 0"
                                            }}
                                            key={i}
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
                            total={this.state.totalPages * this.state.pageSize}
                            pageSize={this.state.pageSize}
                            onChange={this.handlePagination.bind(this)}
                            current={this.state.page}
                        />
                    </Col>
                </Row>
            </>
        );
    }
}

export default PersonalityList;
