import React, { Component } from "react";
import axios from "axios";
import { Input, Form, Button, Row, Col, Avatar, AutoComplete } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = AutoComplete;

class PersonalityCreate extends Component {
    constructor(props) {
        super(props);

        this.savePersonality = this.savePersonality.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    state = {
        children: [],
        personality: {},
        inputsDisabled: false
    };

    wikidataSearch(query, lang = "en") {
        const params = {
            action: "wbsearchentities",
            search: query,
            format: "json",
            errorformat: "plaintext",
            language: lang,
            uselang: lang,
            type: "item",
            origin: "*"
        };

        axios
            .get(`https://www.wikidata.org/w/api.php`, { params })
            .then(response => {
                const { search } = response && response.data;
                const children = search.map(option => (
                    <Option key={option.id} value={option.id}>
                        <span>{option.label}</span>
                        <small>{option.description}</small>
                    </Option>
                ));

                this.setState({
                    isLoading: false,
                    children,
                    search
                });
            })
            .catch(e => {
                throw e;
            });
    }

    _handleSearch = query => {
        this.setState({ isLoading: true });
        this.wikidataSearch(query);
    };

    onSelect(wikidataId) {
        const wbEntities = this.state.search.filter(
            child => child.id === wikidataId
        );
        console.log("wbEntities", wbEntities);
        if (Array.isArray(wbEntities) && wbEntities.length > 0) {
            const wbEntity = wbEntities[0];
            axios
                .get(`${process.env.API_URL}/wikidata/${wbEntity.id}`)
                .then(response => {
                    const personality = {
                        ...response.data,
                        wikidata: wbEntity.id
                    };
                    this.setState({
                        personality,
                        inputsDisabled: true
                    });
                })
                .catch(() => {
                    console.log(
                        "Error while fetching Wikdiata metadata of Personality "
                    );
                });
        } else {
            this.setState({
                personality: {
                    bio: ""
                },
                inputsDisabled: false
            });
        }
    }

    savePersonality(e) {
        e.preventDefault();
        // TODO: Check if personality already exists
        axios
            .post(`${process.env.API_URL}/personality`, this.state.personality)
            .then(response => {
                console.log(response.data);
            })
            .catch(() => {
                console.log("Error while saving claim");
            });
    }

    render() {
        const { personality } = this.state;
        const imageStyle = {
            backgroundImage: `url(${personality.image})`
        };
        return (
            <Row gutter={[32, 0]}>
                <Col span={6}>
                    {personality.image ? (
                        <div className="thumbnail">
                            <div className="thumbnail__container">
                                <div
                                    className="thumbnail__img"
                                    style={imageStyle || ""}
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <Avatar
                            shape="square"
                            size={200}
                            icon={<UserOutlined />}
                        />
                    )}
                </Col>
                <Col span={18}>
                    <Form onSubmit={this.savePersonality}>
                        <Form.Item
                            label="Warning"
                            hasFeedback
                            validateStatus="warning"
                        >
                            <AutoComplete
                                style={{
                                    width: 200
                                }}
                                onSearch={this._handleSearch}
                                onSelect={this.onSelect}
                                // TODO: onChange
                                // TODO: selected value should be label
                                placeholder="Name of the personality"
                            >
                                {this.state.children}
                            </AutoComplete>
                            {/* <Complete /> */}
                        </Form.Item>
                        <Form.Item
                            label="Warning"
                            hasFeedback
                            validateStatus="warning"
                        >
                            <TextArea
                                placeholder="Bio"
                                rows={4}
                                name="bio"
                                value={this.state.personality.bio || ""}
                                id="bio"
                                disabled={this.state.inputsDisabled}
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Personality
                        </Button>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default PersonalityCreate;
