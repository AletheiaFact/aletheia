import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { Spin, Table, Avatar, Button, Col, Row, Typography } from "antd";
import "./PersonalityView.css";
import { UserOutlined } from "@ant-design/icons";
import ReviewStats from "../ReviewStats";

const { Title, Text } = Typography;
const { Column } = Table;

class PersonalityView extends Component {
    constructor(props) {
        super(props);
        this.createClaim = this.createClaim.bind(this);
        this.viewClaim = this.viewClaim.bind(this);
        this.state = {};
    }

    componentDidMount() {
        const self = this;
        self.getPersonality();
    }

    getPersonality() {
        axios
            .get(
                `${process.env.API_URL}/personality/${this.props.match.params.id}`
            )
            .then(response => {
                const personality = response.data;
                this.setState({ personality });
            })
            .catch(() => {
                console.log("Error while fetching Personality");
            });
    }

    createClaim() {
        const path = `./${this.props.match.params.id}/claim/create`;
        this.props.history.push(path);
    }

    viewClaim(id) {
        const path = `./${this.props.match.params.id}/claim/${id}`;
        this.props.history.push(path);
    }

    render() {
        const personality = this.state.personality;
        if (personality) {
            const imageStyle = {
                backgroundImage: `url(${personality.image})`
            };
            const { reviews } = personality.stats;
            return (
                <>
                    <Row gutter={[32, 0]}>
                        <Col span={6}>
                            {personality.image ? (
                                <div className="thumbnail">
                                    <div className="thumbnail__container">
                                        <div
                                            className="thumbnail__img"
                                            style={imageStyle}
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
                        <Col span={12}>
                            <Row>
                                <Typography>
                                    <Title>{personality.name}</Title>
                                    <Text>{personality.bio}</Text>
                                </Typography>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row justify="end">
                                <Col span={24} flex="column">
                                    <ReviewStats dataSource={reviews} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <div style={{ width: "100%", padding: "15px" }}>
                            <Button
                                onClick={this.createClaim}
                                type="primary"
                                style={{ marginBottom: 16 }}
                            >
                                Add Claim
                            </Button>
                            <Table
                                dataSource={personality.claims}
                                rowKey={record => record._id}
                            >
                                <Column
                                    width="70%"
                                    title="Title"
                                    dataIndex="title"
                                    key="title"
                                />

                                <Column
                                    title="Action"
                                    key="action"
                                    render={record => (
                                        <Button
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.viewClaim(record._id);
                                            }}
                                        >
                                            View Claim
                                        </Button>
                                    )}
                                />
                            </Table>
                        </div>
                    </Row>
                </>
            );
        } else {
            return (
                <Spin
                    tip="Loading..."
                    style={{
                        textAlign: "center",
                        position: "absolute",
                        top: "50%",
                        width: "100%"
                    }}
                ></Spin>
            );
        }
    }
}

export default withRouter(PersonalityView);
